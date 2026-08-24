import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDirectory=join(dirname(fileURLToPath(import.meta.url)),'..');
const simulatorsDirectory=join(rootDirectory,'Simuladores de examen');
const fileNames=(await readdir(simulatorsDirectory)).filter((fileName)=>fileName.endsWith('.html'));
fileNames.sort(new Intl.Collator('es',{numeric:true,sensitivity:'base'}).compare);
const simulators=[];const questions=[];
for(const fileName of fileNames){
    const content=await readFile(join(simulatorsDirectory,fileName),'utf8');
    const title=content.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1].replace(/\s+/g,' ').trim()||fileName.replace(/\.html$/,'');
    const number=fileName.match(/^Actividad_(\d+)_/)?.[1];
    simulators.push({file:fileName,title,activity:number?`Actividad ${number}`:'Actividad'});
    const dataMatch=content.match(/const\s+DATA\s*=\s*(\[[\s\S]*?\]);\s*(?:let|const|function|\$\(|document\.)/);
    if(!dataMatch)continue;
    try{const data=JSON.parse(dataMatch[1]);for(const question of data){if(typeof question?.prompt==='string'&&Array.isArray(question.options)&&Number.isInteger(question.answer)&&question.options[question.answer])questions.push({...question,source:title})}}catch(error){console.warn(`No se pudo leer el banco de ${fileName}: ${error.message}`)}
}
if(questions.length<120)throw new Error(`Solo se extrajeron ${questions.length} reactivos; se requieren al menos 120.`);
const output=`/* Archivo generado por scripts/generar-catalogo-egel.mjs. */\nwindow.SIMULADORES=${JSON.stringify(simulators)};\nwindow.BANCO_PREGUNTAS_EGEL=${JSON.stringify(questions)};\n`;
await writeFile(join(rootDirectory,'catalogo-simuladores.js'),output);
const navigationOutput=`/* Archivo generado por scripts/generar-catalogo-egel.mjs. */\nwindow.SIMULADORES_NAVEGACION=${JSON.stringify(simulators.map((simulator)=>simulator.file))};\n`;
await writeFile(join(rootDirectory,'navegacion-simuladores.js'),navigationOutput);
console.log(`Catálogo generado: ${simulators.length} simuladores y ${questions.length} reactivos.`);