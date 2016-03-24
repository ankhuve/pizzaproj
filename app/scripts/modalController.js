/**
 * Created by Erik on 2016-03-24.
 */
var modalToggled = false;

function modalToggle(){
    event.stopPropagation();
    modalToggled = !modalToggled;
    if ( modalToggled ){
        controls.enabled = false;
        document.getElementById( "modalBg" ).style.display = "block";
        document.getElementById( "modal" ).style.transform = "translateY(5vh)";
        document.getElementById( "modalBg" ).style.background = "rgba(0,0,0,0.5)";
    } else{
        closeModal();
    }
}

function closeModal(){
    event.stopPropagation();
    controls.enabled = false;
    document.getElementById( "modal" ).style.transform = "translateY(-100vh)";
    document.getElementById( "modalBg" ).style.background = "rgba(0,0,0,0)";
    document.getElementById( "modalBg" ).style.display = "none";
    modalToggled = false;
}