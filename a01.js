/*
  Basic File I/O for displaying
  Skeleton Author: Joshua A. Levine
  Modified by: Amir Mohammad Esmaieeli Sikaroudi
  Email: amesmaieeli@email.arizona.edu
  */

//access DOM elements we'll use
var input = document.getElementById("load_image");
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var ppm_img_data;
var angle = 0.0;

var scale;
var normalization_mat;
var normalization_mat_inv;

var lastTime;

function initialize_normalization_mats() {
    scale = Math.min(ppm_img_data.width, ppm_img_data.height) / Math.sqrt(ppm_img_data.width * ppm_img_data.width + ppm_img_data.height * ppm_img_data.height); // Scale with no borders clipping.
    normalization_mat = Matrix3.mul_mats(new Matrix3().load_translate(-1 / scale, -1 / scale), new Matrix3().load_scale(2 / (scale * ppm_img_data.width), 2 / (scale * ppm_img_data.height)));
    normalization_mat_inv = Matrix3.mul_mats(new Matrix3().load_scale(ppm_img_data.width / 2, ppm_img_data.height / 2), new Matrix3().load_translate(1, 1));
}

function display_transformed_image(now) {
    if (!lastTime) {lastTime = now;}
    var delta = now - lastTime;
    lastTime = now;

    document.getElementById("deltap").innerText = "Time since last frame: " + (delta / 1000).toFixed(2) + "s";

    let transform = Matrix3.mul_mats(normalization_mat_inv, Matrix3.mul_mats(new Matrix3().load_rotation(angle), normalization_mat));
    let dest_image = ctx.createImageData(ppm_img_data.width, ppm_img_data.height);
    for (let desty = 0; desty < dest_image.height; desty++) {
        for (let destx = 0; destx < dest_image.width; destx++) {
            let src = Matrix3.mul_vec(transform, new Vec3(destx, desty, 1.));
            let src_pixel = read_pixel(ppm_img_data, src.x, src.y);
            write_pixel(dest_image, src_pixel, destx, desty);
        }
    }

    ctx.putImageData(dest_image, canvas.width / 2 - ppm_img_data.width / 2, canvas.height / 2 - ppm_img_data.height / 2);
    angle += 0.2;
    requestAnimationFrame(display_transformed_image);
}

//Function to process upload
var upload = function () {
    if (input.files.length <= 0) {
        return;
    }

    var file = input.files[0];
    console.log("You chose", file.name);
    if (file.type) console.log("It has type", file.type);
    var fReader = new FileReader();
    fReader.readAsBinaryString(file);

    fReader.onload = function() {
        //if successful, file data has the contents of the uploaded file
        var file_data = fReader.result;
        parsePPM(file_data);
    }

    /*
    * TODO: ADD CODE HERE TO DO 2D TRANSFORMATION and ANIMATION
    * Modify any code if needed
    * Hint: Write a rotation method, and call WebGL APIs to reuse the method for animation
    */
    fReader.onloadend = () => {
        initialize_normalization_mats();
        requestAnimationFrame(display_transformed_image)
    };
}

// Load PPM Image to Canvas
function parsePPM(file_data){
    /*
   * Extract header
   */
    var format = "";
    var width = 0;
    var height = 0;
    var max_v = 0;
    var lines = file_data.split(/#[^\n]*\s*|\s+/); // split text by whitespace or text following '#' ending with whitespace
    var counter = 0;
    // get attributes
    for(var i = 0; i < lines.length; i ++){
        if(lines[i].length == 0) {continue;} //in case, it gets nothing, just skip it
        if(counter == 0){
            format = lines[i];
        }else if(counter == 1){
            width = lines[i];
        }else if(counter == 2){
            height = lines[i];
        }else if(counter == 3){
            max_v = Number(lines[i]);
        }else if(counter > 3){
            break;
        }
        counter ++;
    }
    console.log("Format: " + format);
    console.log("Width: " + width);
    console.log("Height: " + height);
    console.log("Max Value: " + max_v);
    /*
     * Extract Pixel Data
     */
    var bytes = new Uint8Array(3 * width * height);  // i-th R pixel is at 3 * i; i-th G is at 3 * i + 1; etc.
    // i-th pixel is on Row i / width and on Column i % width
    // Raw data must be last 3 X W X H bytes of the image file
    var raw_data = file_data.substring(file_data.length - width * height * 3);
    for(var i = 0; i < width * height * 3; i ++){
        // convert raw data byte-by-byte
        bytes[i] = raw_data.charCodeAt(i);
    }
    // update width and height of canvas
    document.getElementById("canvas").setAttribute("width", width);
    document.getElementById("canvas").setAttribute("height", height);
    // create ImageData object
    var image_data = ctx.createImageData(width, height);
    // fill ImageData
    for(var i = 0; i < image_data.data.length; i+= 4){
        let pixel_pos = i / 4;
        image_data.data[i + 0] = bytes[pixel_pos * 3 + 0]; // Red ~ i + 0
        image_data.data[i + 1] = bytes[pixel_pos * 3 + 1]; // Green ~ i + 1
        image_data.data[i + 2] = bytes[pixel_pos * 3 + 2]; // Blue ~ i + 2
        image_data.data[i + 3] = 255; // A channel is default to 255
    }
    ctx.putImageData(image_data, canvas.width/2 - width/2, canvas.height/2 - height/2);
    ppm_img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

read_pixel = (image, x, y) => {
    x = Math.min(Math.max(x, 0), image.width);
    y = Math.min(Math.max(y, 0), image.height);
    return new Vec3(
        image.data[0 + round(x) * 4 + round(y) * 4 * image.width],
        image.data[1 + round(x) * 4 + round(y) * 4 * image.width],
        image.data[2 + round(x) * 4 + round(y) * 4 * image.width]
    );
}

write_pixel = (image, pixel, x, y) => {
    x = Math.min(Math.max(x, 0), image.width);
    y = Math.min(Math.max(y, 0), image.height);
    image.data[0 + round(x) * 4 + round(y) * 4 * image.width] = pixel.x;
    image.data[1 + round(x) * 4 + round(y) * 4 * image.width] = pixel.y;
    image.data[2 + round(x) * 4 + round(y) * 4 * image.width] = pixel.z;
    image.data[3 + round(x) * 4 + round(y) * 4 * image.width] = 255;
}

//Connect event listeners
input.addEventListener("change", upload);