document.getElementById("fotoInput").addEventListener("change", function(event) {
    const reader = new FileReader();
    reader.onload = function(){
        document.getElementById("previewFoto").src = reader.result;
    }
    reader.readAsDataURL(event.target.files[0]);
});