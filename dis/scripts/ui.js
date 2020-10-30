let settingPanel = document.getElementById("settingPanel");

$('.ui.sidebar').sidebar({
    dimPage: false,
    mobileTransition: 'overlay',
    transition: 'overlay',
});

let btnSetting = document.getElementById("btnSetting");

btnSetting.addEventListener("click", function (evt) {
    $('.ui.sidebar').sidebar('toggle');
});

let btnRealTime = document.getElementById("btnRealTime");
btnRealTime.addEventListener("click", function(evt){
    btnSlowMotion.classList.remove("active");
    btnRealTime.classList.add("active");
    
    threeD.changeToRealTime();
});

let btnSlowMotion = document.getElementById("btnSlowMotion");
btnSlowMotion.addEventListener("click", function(evt){
    btnRealTime.classList.remove("active");
    btnSlowMotion.classList.add("active");
    
    threeD.changeToSlowMotion();
});

let btnSwitchVacuumPump = document.getElementById("btnSwitchVacuumPump");
btnSwitchVacuumPump.addEventListener("click", function(evt){
    if(threeD.isVacuumPumpRunning()){
        threeD.stopVacuumPump();
        btnSwitchVacuumPump.innerText = "လေစုပ်စက်ဖွင့်";
    }
    else{
        threeD.startVacuumPump();
        btnSwitchVacuumPump.innerText = "လေစုပ်စက်ပိတ်";
    }
});

let chkShowInternal = document.getElementById("chkShowInternal");
chkShowInternal.addEventListener("change", function(evt){
    threeD.showInternal(this.checked);
});

let chkBellJar = document.getElementById("chkBellJar");
chkBellJar.addEventListener("change", function(evt){
    threeD.showBellJar(this.checked);
});


let chkShowCurrentFlow = document.getElementById("chkShowCurrentFlow");
chkShowCurrentFlow.addEventListener("change", function(evt){
    threeD.setShowCurrentFlow(this.checked);
}); 

let ckMakeMoreRealistic = document.getElementById("ckMakeMoreRealistic");
ckMakeMoreRealistic.addEventListener("click", function(evt){
    threeD.makeMoreRealistic(this.checked);
});

let btnInfo = document.getElementById('btnInfo');
btnInfo.addEventListener("click", function(evt){
    $('.ui.modal').modal('show');
});

let btnHome = document.getElementById("btnHome");
btnHome.addEventListener("click", function(evt){
    threeD.resetCamera();
});