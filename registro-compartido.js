(function(){
    const student=sessionStorage.getItem('egel_student_name');
    const group=sessionStorage.getItem('egel_student_group')||'';
    if(!student){window.location.replace('../index.html');return}
    const nativeSetItem=Storage.prototype.setItem;
    Storage.prototype.setItem=function(key,value){if(this===localStorage&&(String(value)===student||String(value)===group))return;return nativeSetItem.call(this,key,value)};
    const style=document.createElement('style');
    style.textContent='#start,#startScreen{visibility:hidden!important}.egel-navigation{position:fixed;z-index:9999;right:16px;bottom:16px;display:flex;gap:6px;max-width:calc(100vw - 32px);padding:7px;background:#fff;border:1px solid #cbd5df;border-radius:6px;box-shadow:0 5px 18px #17253633;font-family:Arial,sans-serif}.egel-navigation button{border:0;border-radius:4px;padding:9px 11px;background:#163b65;color:#fff;font:700 13px Arial,sans-serif;cursor:pointer}.egel-navigation button:hover{background:#0c6cb5}.egel-navigation button:disabled{cursor:not-allowed;opacity:.45}@media(max-width:560px){.egel-navigation{right:8px;bottom:8px;gap:4px;padding:5px}.egel-navigation button{padding:8px;font-size:12px}}';
    document.head.appendChild(style);
    function createNavigation(){
        const files=window.SIMULADORES_NAVEGACION||[];
        const fileName=decodeURIComponent(location.pathname.split('/').pop()||'');
        const currentIndex=files.indexOf(fileName);
        const navigation=document.createElement('nav');
        navigation.className='egel-navigation';
        navigation.setAttribute('aria-label','Navegación de simuladores');
        const addButton=(label,action,disabled=false)=>{const button=document.createElement('button');button.type='button';button.textContent=label;button.disabled=disabled;button.addEventListener('click',action);navigation.appendChild(button)};
        addButton('Menú',()=>location.href='../index.html');
        addButton('Secciones',()=>location.href='../index.html?catalogo=1');
        addButton('Anterior',()=>location.href=encodeURIComponent(files[currentIndex-1]),currentIndex<=0);
        addButton('Siguiente',()=>location.href=encodeURIComponent(files[currentIndex+1]),currentIndex<0||currentIndex===files.length-1);
        addButton('Salir',()=>{sessionStorage.removeItem('egel_student_name');sessionStorage.removeItem('egel_student_group');location.replace('../index.html')});
        document.body.appendChild(navigation);
    }
    addEventListener('DOMContentLoaded',()=>{const studentField=document.getElementById('student')||document.getElementById('studentName');const groupField=document.getElementById('group');if(studentField)studentField.value=student;if(groupField)groupField.value=group;document.getElementById('startBtn')?.click();const navigationScript=document.createElement('script');navigationScript.src='../navegacion-simuladores.js';navigationScript.addEventListener('load',createNavigation);document.head.appendChild(navigationScript)});
}());