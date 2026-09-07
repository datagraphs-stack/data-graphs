import {parseCsv,profileDataset,executePlan} from './engine.js';
import {canonicalSemantics} from './semantics.js';
import {createModelIntentProvider,InterpretationStatus,resolveClarification} from './intent.js';
import {appendRevision,createDataGraph} from './datagraph.js';
import {base64ToBytes} from './identity.js';
import {deserializeDataGraph,validateDataGraph} from './datagraph.js';
import {assessDatasetCompatibility} from './compatibility.js';

const app=document.querySelector('#app');
const intentProvider=createModelIntentProvider();
let state={sourceBytes:null,rows:[],profile:null,compatibility:null,result:null,name:'',dataGraph:null,revisions:[],pendingInterpretation:null,persistedRevisionCount:0,writeToken:null,loadedFromStorage:false};
app.innerHTML=`<header><a class="brand" href="/" aria-label="DataGraphs home"><span class="brandMark">D</span><span class="brandName">DataGraphs</span></a><div class="breadcrumbs"><span>Workspace</span><b>/</b><strong>Revenue analysis</strong></div><div class="headerActions"><span class="systemStatus"><i></i>Engine ready</span><button id="loadSample" class="quiet">Use sample data</button><button class="avatar" aria-label="Account menu">DG</button></div></header><div class="shell"><nav class="productNav" aria-label="Primary navigation"><div class="navGroup"><span>Workspace</span><a class="active" href="#"><i class="navIcon">⌁</i>Studio</a><a href="#"><i class="navIcon">▦</i>DataGraphs</a><a href="#"><i class="navIcon">◫</i>Sources</a></div><div class="navGroup"><span>Manage</span><a href="#"><i class="navIcon">◇</i>Semantics</a><a href="#"><i class="navIcon">↗</i>Shared</a></div><div class="navFoot"><strong>Deterministic by design</strong><p>Every result carries its source, plan, and execution evidence.</p></div></nav><main><aside class="sourcePanel"><div class="panelTitle"><div><div class="eyebrow">01 · SOURCE</div><h2>Dataset</h2></div></div><label class="upload"><span class="uploadIcon">↑</span><strong>Upload a CSV</strong><span>Drop a file here or browse</span><small>Your source remains local until you publish.</small><input id="file" type="file" accept=".csv,text/csv"></label><div id="dataset" class="empty"><span class="emptyDot"></span><strong>No source connected</strong><p>Start with a commerce export or use the sample dataset.</p></div></aside><section class="canvas"><div class="canvasBar"><div><div class="eyebrow">02 · DATAGRAPH</div><span>Authoritative result</span></div><span class="draftBadge">LOCAL DRAFT</span></div><div id="hero"><div class="emptyHero"><div class="heroGlyph"><i></i><i></i><i></i></div><div class="eyebrow">VERIFIABLE ANALYSIS</div><h1>Turn a question into<br>an answer you can prove.</h1><p>Connect a source, define the intent, and inspect every step between your data and the result.</p><button id="heroSample" class="heroAction">Explore with sample data <span>→</span></button><div class="proofStrip"><span><b>01</b> Source bound</span><span><b>02</b> Plan validated</span><span><b>03</b> Values computed</span></div></div></div></section><aside class="right"><div class="eyebrow">03 · INTENT</div><h2>Ask the data</h2><p class="panelIntro">Describe the decision you need to make. Material ambiguity stops execution.</p><label class="questionLabel" for="question">Question</label><textarea id="question" rows="5">Show monthly net revenue by region, excluding cancelled orders.</textarea><button id="run" disabled>Compute answer <span>→</span></button><div class="boundary"><span class="shield">✓</span><p><strong>Trusted computation boundary</strong>AI proposes a constrained plan. Deterministic code validates and computes every value.</p></div><div id="verify"></div></aside></main></div>`;

const $=selector=>document.querySelector(selector);
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const metricValue=value=>value===null?'Unknown':value.toFixed(2);
function deepFreeze(value){if(value&&typeof value==='object'){Object.freeze(value);for(const child of Object.values(value))deepFreeze(child);}return value;}

function load(sourceBytes,name){
  try{
    const text=new TextDecoder('utf-8',{fatal:true}).decode(sourceBytes);
    const rows=parseCsv(text),profile=profileDataset(rows),compatibility=assessDatasetCompatibility(profile,canonicalSemantics);
    state={sourceBytes:new Uint8Array(sourceBytes),rows,profile,compatibility,result:null,name,dataGraph:null,revisions:[],pendingInterpretation:null,persistedRevisionCount:0,writeToken:null,loadedFromStorage:false};
    $('#run').disabled=!compatibility.compatible;
    $('#dataset').innerHTML=`<div class="datasetName">${esc(name)}</div><div class="stat"><b>${profile.rowCount}</b> rows · <b>${profile.columns.length}</b> columns</div>${compatibilityPanel(compatibility)}<div class="schema">${profile.columns.map(column=>`<div><span>${esc(column.name)}</span><em>${column.type}</em><small>${column.uniqueCount} unique${column.nullCount?` · ${column.nullCount} blank`:''}</small></div>`).join('')}</div>`;
    $('#hero').innerHTML=compatibility.compatible?`<div class="emptyHero"><h1>Dataset ready.</h1><p>Review inferred structure, then compute the canonical question.</p></div>`:`<div class="emptyHero incompatible"><h1>Dataset not compatible yet.</h1><p>This narrow proof will not guess mappings or semantics. Correct the listed columns and upload again.</p></div>`;
    $('#verify').innerHTML='';
  }catch(error){alert(error.message);}
}

function compatibilityPanel(compatibility){return compatibility.compatible?`<div class="compatibility compatible"><strong>Compatible with the commerce proof</strong><span>Monthly net revenue by region using declared status policy.</span></div>`:`<div class="compatibility incompatible"><strong>Not compatible with this proof</strong><ul>${compatibility.issues.map(issue=>`<li>${esc(issue)}</li>`).join('')}</ul></div>`;}

$('#file').addEventListener('change',async event=>{const file=event.target.files[0];if(file)load(new Uint8Array(await file.arrayBuffer()),file.name);});
$('#loadSample').addEventListener('click',async()=>load(new Uint8Array(await (await fetch('/orders.csv')).arrayBuffer()),'orders.csv'));
$('#heroSample').addEventListener('click',()=>$('#loadSample').click());
$('#run').addEventListener('click',async()=>{
  const button=$('#run');button.disabled=true;button.textContent='Interpreting…';
  try{const interpretation=await intentProvider.propose({question:$('#question').value,profile:state.profile,semantics:canonicalSemantics,previousRevision:state.revisions.at(-1)});if(interpretation.status===InterpretationStatus.NEEDS_CLARIFICATION){state.pendingInterpretation=interpretation;renderClarification(interpretation);return;}await executeInterpretation(interpretation);}finally{button.disabled=false;button.textContent='Compute answer';}
});

async function executeInterpretation(interpretation){
  try{
    if(!interpretation.candidate?.plan)throw new Error('Only a validated candidate plan can execute.');
    const output=executePlan(state.rows,interpretation.candidate.plan,state.profile,canonicalSemantics);
    state.dataGraph=state.dataGraph?await appendRevision(state.dataGraph,{question:interpretation.question,interpretation,plan:interpretation.candidate.plan,output}):await createDataGraph({sourceBytes:state.sourceBytes,originalFilename:state.name,profile:state.profile,semantics:canonicalSemantics,question:interpretation.question,interpretation,plan:interpretation.candidate.plan,output});
    const storedRevision=state.dataGraph.revisions.at(-1),revision=deepFreeze({number:state.dataGraph.revisions.length,question:storedRevision.question,interpretation:storedRevision.interpretation,plan:storedRevision.validatedPlan,output:structuredClone(output),revisionId:storedRevision.revisionId,parentRevisionId:storedRevision.parentRevisionId,resultHash:storedRevision.result.sha256});
    state.revisions=[...state.revisions,revision];state.pendingInterpretation=null;state.result=output;render(output,revision);
  }catch(error){alert(error.message);}
}

function renderClarification(interpretation){
  const ambiguity=interpretation.ambiguities[0];
  const recovery=ambiguity.choices.length?'Choose an interpretation before DataGraphs creates the next plan.':ambiguity.id==='provider_unavailable'?'No calculation ran. Try again later; the existing result and history are unchanged.':'No calculation ran. This narrow proof cannot safely answer that question; revise it or use the canonical question.';
  $('#verify').innerHTML=`<div class="clarification"><div class="eyebrow">${ambiguity.id==='provider_unavailable'?'INTENT UNAVAILABLE':'NEEDS CLARIFICATION'}</div><h2>${esc(ambiguity.prompt)}</h2><p>${recovery}</p>${ambiguity.choices.map(choice=>`<button class="choice" data-choice="${choice.id}" ${choice.available?'':'disabled'}><strong>${esc(choice.label)}</strong><span>${esc(choice.description)}</span>${choice.available?'':'<em>Not supported in this proof</em>'}</button>`).join('')}</div>`;
  document.querySelectorAll('.choice:not(:disabled)').forEach(button=>button.onclick=()=>executeInterpretation(resolveClarification(interpretation,ambiguity.id,button.dataset.choice)));
}

function render(output,revision){
  if(output.evidence.comparison){renderComparison(output,revision);return;}
  const rows=output.rows,max=Math.max(...rows.map(row=>row.sum_net_revenue??0),1),colors={North:'#ff642d',South:'#18a67e',West:'#6c78dc'};
  $('#hero').innerHTML=`<div class="resultHead"><div><div class="eyebrow">${resultLabel(revision)}</div><h1>Monthly net revenue by region</h1><p class="unit">Currency unknown · refunded rows included by declared policy</p></div><button id="verifyBtn" class="quiet">Verify calculation</button></div><div id="persistence"></div><div class="chart" role="img" aria-label="Bar chart of monthly net revenue by region">${rows.map(row=>`<div class="barRow"><time>${row.order_date_month}</time><span class="region">${esc(row.region)}</span><div class="track"><i style="width:${(row.sum_net_revenue??0)/max*100}%;background:${colors[row.region]||'#7289da'}"></i></div><b>${metricValue(row.sum_net_revenue)}</b></div>`).join('')}</div><button id="followup" class="quiet followup">Revise: top three vs previous year</button><details><summary>Result table · ${rows.length} rows</summary><table><thead><tr><th>Month</th><th>Region</th><th>Net revenue (currency unknown)</th></tr></thead><tbody>${rows.map(row=>`<tr><td>${row.order_date_month}</td><td>${esc(row.region)}</td><td>${metricValue(row.sum_net_revenue)}</td></tr>`).join('')}</tbody></table></details>`;
  $('#verifyBtn').onclick=()=>renderVerify(output.evidence,revision);
  $('#followup').onclick=()=>{$('#question').value='Show the top three regions by net revenue and compare them with the previous year.';$('#run').focus();};
  renderPersistenceControls();
}

function renderComparison(output,revision){
  const rows=output.rows,max=Math.max(...rows.flatMap(row=>[row.sum_net_revenue,row.previous_sum_net_revenue??0]),1);
  const percent=value=>value===null?'Unknown':`${value>=0?'+':''}${(value*100).toFixed(1)}%`;
  $('#hero').innerHTML=`<div class="resultHead"><div><div class="eyebrow">${resultLabel(revision)}</div><h1>Top three regions · ${output.evidence.comparison.latestPeriod} vs ${output.evidence.comparison.previousPeriod}</h1><p class="revisionFrom">Revised from: ${esc(state.revisions.at(-2)?.question||'initial analysis')}</p><p class="unit">Confirmed annual-total interpretation · currency unknown · refunded rows included</p></div><button id="verifyBtn" class="quiet">Verify calculation</button></div><div id="persistence"></div><div class="comparison" role="img" aria-label="Top three regions compared with previous year">${rows.map(row=>`<article><div><strong>${esc(row.region)}</strong><span>${percent(row.percent_change_sum_net_revenue)}</span></div><div class="compareBar"><i style="width:${row.sum_net_revenue/max*100}%"></i><b>${row.order_date_year} · ${metricValue(row.sum_net_revenue)}</b></div><div class="compareBar previous"><i style="width:${(row.previous_sum_net_revenue??0)/max*100}%"></i><b>${row.previous_period} · ${metricValue(row.previous_sum_net_revenue)}</b></div></article>`).join('')}</div><details><summary>Result table · ${rows.length} ranked regions</summary><table><thead><tr><th>Region</th><th>${output.evidence.comparison.latestPeriod}</th><th>${output.evidence.comparison.previousPeriod}</th><th>Change</th></tr></thead><tbody>${rows.map(row=>`<tr><td>${esc(row.region)}</td><td>${metricValue(row.sum_net_revenue)}</td><td>${metricValue(row.previous_sum_net_revenue)}</td><td>${percent(row.percent_change_sum_net_revenue)}</td></tr>`).join('')}</tbody></table></details>`;
  $('#verifyBtn').onclick=()=>renderVerify(output.evidence,revision);
  renderPersistenceControls();
}

function resultLabel(revision){return `${state.loadedFromStorage?'STORED HISTORICAL RESULT':'AUTHORITATIVE RESULT'} · REVISION ${revision.number}`;}

function renderPersistenceControls(){
  const owner=state.writeToken||!state.persistedRevisionCount;
  const readOnlyReason='Creator key unavailable in this browser. This public-link DataGraph is read-only here; revisions cannot be saved.';
  $('#persistence').innerHTML=`<div class="persistence"><div><strong>${state.persistedRevisionCount===state.dataGraph.revisions.length?'Saved DataGraph':'Unsaved DataGraph'}</strong><span>${state.persistedRevisionCount?'Stable route · public to anyone with the link':'Not private: publishing stores the exact CSV and complete DataGraph on Cloudflare.'}</span></div>${owner?`<button id="saveGraph" class="quiet">${state.persistedRevisionCount?'Save revision':'Review & publish'}</button>`:`<em title="${readOnlyReason}">Read-only · creator key unavailable</em>`}</div>`;
  if(owner)$('#saveGraph').onclick=state.persistedRevisionCount?saveDataGraph:renderPublishConsent;
}

function renderPublishConsent(){
  $('#persistence').innerHTML=`<div class="publishConsent"><strong>Publish this exact source?</strong><p>This creates an unlisted public link and stores the complete DataGraph, including the exact uploaded CSV bytes, on Cloudflare. Anyone with the URL can access it. This is not private storage.</p><label><input id="publishConsent" type="checkbox"> I understand this dataset will be accessible to anyone with the link.</label><div><button id="cancelPublish" class="quiet">Cancel</button><button id="confirmPublish" disabled>Publish DataGraph</button></div></div>`;
  $('#publishConsent').onchange=event=>$('#confirmPublish').disabled=!event.target.checked;$('#cancelPublish').onclick=renderPersistenceControls;$('#confirmPublish').onclick=saveDataGraph;
}

async function saveDataGraph(){
  const button=$('#saveGraph')||$('#confirmPublish');button.disabled=true;button.textContent='Saving…';
  try{
    const creating=!state.persistedRevisionCount,url=creating?'/api/datagraphs':`/api/datagraphs/${encodeURIComponent(state.dataGraph.dataGraphId)}`,headers={'content-type':'application/json'};
    if(!creating)headers.authorization=`Bearer ${state.writeToken}`;
    const response=await fetch(url,{method:creating?'POST':'PUT',headers,body:JSON.stringify(state.dataGraph)}),body=await response.json();
    if(!response.ok)throw new Error(body.error||'Save failed.');
    if(creating){state.writeToken=body.writeToken;localStorage.setItem(`datagraph:${state.dataGraph.dataGraphId}:writeToken`,body.writeToken);}
    state.persistedRevisionCount=state.dataGraph.revisions.length;history.pushState({},'',body.path);renderPersistenceControls();
  }catch(error){alert(error.message);button.disabled=false;button.textContent='Retry save';}
}

function renderVerify(evidence,revision){
  const metric=evidence.semantics[0];
  const provider=revision.interpretation.provider||{};
  $('#verify').innerHTML=`<div class="verify"><div class="eyebrow">EVIDENCE · REVISION ${revision.number}</div><h2>Verify</h2><dl><dt>DataGraph entity</dt><dd class="identity">${esc(state.dataGraph.dataGraphId)}</dd><dt>Source identity</dt><dd class="identity">${esc(state.dataGraph.source.sourceId)}</dd><dt>Revision identity</dt><dd class="identity">${esc(revision.revisionId)}</dd><dt>Parent revision</dt><dd class="identity">${esc(revision.parentRevisionId??'None — root revision')}</dd><dt>Result identity</dt><dd class="identity">${esc(revision.resultHash)}</dd><dt>Question</dt><dd>${esc(revision.question)}</dd><dt>Interpretation</dt><dd>${revision.interpretation.status}${revision.interpretation.qualifications?.length?` · ${esc(revision.interpretation.qualifications.join(' '))}`:''}</dd><dt>Intent provider</dt><dd>${esc(provider.id||'unknown')} · ${esc(provider.model||provider.version||'unknown')} · prompt ${esc(provider.promptVersion||'not recorded')}</dd><dt>Source</dt><dd>${esc(state.name)} · ${state.dataGraph.source.byteLength} bytes</dd><dt>Metric semantic</dt><dd>${esc(metric.id)} v${metric.version} · ${esc(metric.label)}</dd><dt>Unit</dt><dd>${esc(metric.unit.kind)} · currency ${esc(metric.unit.currency)}</dd><dt>Status policy</dt><dd>Exclude ${esc(metric.statusPolicy.exclude.join(', '))}; include other statuses</dd><dt>Null policy</dt><dd>${esc(metric.nullPolicy)}</dd><dt>Trace</dt><dd>v${evidence.trace.version} · plan v${evidence.trace.planVersion} · engine ${esc(evidence.trace.engineVersion)}</dd></dl><h3>Executed operations</h3><ol class="trace">${evidence.trace.operations.map(renderTraceOperation).join('')}</ol>${evidence.trace.warnings.length?`<div class="warning">${esc(evidence.trace.warnings.join(' '))}</div>`:''}<details><summary>Execution trace</summary><pre>${esc(JSON.stringify(evidence.trace,null,2))}</pre></details><details><summary>Validated structured plan</summary><pre>${esc(JSON.stringify(evidence.plan,null,2))}</pre></details></div>`;
}

function renderTraceOperation(operation){
  const rowFlow=`${operation.inputRows} → ${operation.outputRows} rows`;
  if(operation.type==='filter')return `<li><strong>Filter</strong><span>${esc(operation.filters.map(filter=>`${filter.field} ${filter.operator} ${JSON.stringify(filter.value)}`).join('; ')||'No filters')} · ${rowFlow}</span></li>`;
  if(operation.type==='group')return `<li><strong>Group</strong><span>${esc(operation.dimensions.map(dimension=>dimension.bucket?`${dimension.field} by ${dimension.bucket}`:dimension.field).join(', '))} · ${rowFlow}</span></li>`;
  if(operation.type==='aggregate')return `<li><strong>Aggregate</strong><span>${esc(operation.metrics.map(metric=>`${metric.aggregation} ${metric.field} (${metric.semanticId})`).join(', '))} · ${rowFlow}</span></li>`;
  if(operation.type==='rank')return `<li><strong>Rank</strong><span>${esc(`top ${operation.ranking.limit} ${operation.ranking.dimension} by ${operation.ranking.by} for ${operation.ranking.period}`)} · ${rowFlow}</span></li>`;
  if(operation.type==='compare')return `<li><strong>Compare</strong><span>${esc(`${operation.comparison.latestPeriod} with ${operation.comparison.previousPeriod} using ${operation.comparison.offset}`)} · ${rowFlow}</span></li>`;
  if(operation.type==='sort')return `<li><strong>Sort</strong><span>${esc(operation.sort.map(sort=>`${sort.field} ${sort.direction}`).join(', '))} · ${rowFlow}</span></li>`;
  if(operation.type==='limit')return `<li><strong>Limit</strong><span>${operation.limit} · ${rowFlow}</span></li>`;
  return `<li><strong>Unknown operation</strong><span>${esc(operation.type)} · ${rowFlow}</span></li>`;
}

async function loadSharedRoute(){
  const match=location.pathname.match(/^\/g\/(dg_[A-Za-z0-9-]+)$/);if(!match)return;
  try{
    const response=await fetch(`/api/datagraphs/${encodeURIComponent(match[1])}`),body=await response.json();if(!response.ok)throw new Error(body.error||'Shared DataGraph could not be loaded.');
    const dataGraph=deserializeDataGraph(JSON.stringify(body.dataGraph)),validation=await validateDataGraph(dataGraph);if(!validation.valid)throw new Error(`Stored DataGraph failed validation: ${validation.errors.join(' ')}`);
    const text=new TextDecoder('utf-8',{fatal:true}).decode(validation.sourceBytes),rows=parseCsv(text),profile=profileDataset(rows),writeToken=localStorage.getItem(`datagraph:${dataGraph.dataGraphId}:writeToken`);
    const compatibility=assessDatasetCompatibility(profile,dataGraph.semantics);state={sourceBytes:validation.sourceBytes,rows,profile,compatibility,result:null,name:dataGraph.source.originalFilename,dataGraph,revisions:[],pendingInterpretation:null,persistedRevisionCount:dataGraph.revisions.length,writeToken,loadedFromStorage:true};
    $('#run').disabled=false;$('#dataset').innerHTML=`<div class="datasetName">${esc(state.name)}</div><div class="stat"><b>${profile.rowCount}</b> rows · <b>${profile.columns.length}</b> columns</div><div class="schema">${profile.columns.map(column=>`<div><span>${esc(column.name)}</span><em>${column.type}</em><small>${column.uniqueCount} unique${column.nullCount?` · ${column.nullCount} blank`:''}</small></div>`).join('')}</div>`;
    state.revisions=dataGraph.revisions.map((storedRevision,index)=>revisionView(dataGraph,storedRevision,index));const revision=state.revisions.at(-1);state.result=revision.output;$('#question').value=revision.question;render(revision.output,revision);
  }catch(error){$('#hero').innerHTML=`<div class="emptyHero"><h1>DataGraph unavailable.</h1><p>${esc(error.message)}</p></div>`;}
}

function revisionView(dataGraph,storedRevision,index){
  const compare=storedRevision.executionTrace.operations.find(operation=>operation.type==='compare'),rank=storedRevision.executionTrace.operations.find(operation=>operation.type==='rank');
  const comparison=compare?{latestPeriod:compare.comparison.latestPeriod,previousPeriod:compare.comparison.previousPeriod,ranking:rank?.ranking}:null;
  const evidence={trace:storedRevision.executionTrace,semantics:dataGraph.semantics.metrics,comparison,warnings:storedRevision.warnings,engineVersion:storedRevision.engineVersion};
  return deepFreeze({number:index+1,question:storedRevision.question,interpretation:storedRevision.interpretation,plan:storedRevision.validatedPlan,output:{rows:storedRevision.result.rows,evidence},revisionId:storedRevision.revisionId,parentRevisionId:storedRevision.parentRevisionId,resultHash:storedRevision.result.sha256});
}

loadSharedRoute();
