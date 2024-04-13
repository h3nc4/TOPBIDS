document.getElementById('imagem').onchange = function (evt) {
    var preview = document.getElementById('imagem-preview');
    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
      document.getElementById('select-image-text').style.display = "none";
    };
    reader.readAsDataURL(file);
  };

  function previewImage(event) {
    var input = event.target;
    var preview = document.getElementById('imagem-preview');
    var selectImageText = document.getElementById('select-image-text');
  
    preview.style.display = "block";
    selectImageText.style.display = "none";
  
    var reader = new FileReader();
    reader.onload = function(){
      preview.src = reader.result;
    };
    reader.readAsDataURL(input.files[0]);
}
