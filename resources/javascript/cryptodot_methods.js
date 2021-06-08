// This is a comment
const cryptoJS = require("crypto-js");
const fs = require('fs');

const cryptodot_data_path = "./cryptodot_data/";
const cryptodot_auth_data_path = "./cryptodot_data/auth/"
const cryptodot_bin_data_path = "./cryptodot_data/bin/"

document.getElementById("encrypt-bin-button").onclick = function()
{
    if(check_if_not_empty(get_bin_data("current_bin_name")) || check_if_not_empty(get_bin_data("current_bin_key")))
    {
        if(check_if_not_empty(get_bin_data("current_bin_data")))
        {
            encrypt_bin();
        }

        else
        {
            play_sound("error");
        }
    }

    else
    {
        play_sound("error");
    }
}

document.getElementById("decrypt-bin-button").onclick = function()
{
    if(check_if_not_empty(get_bin_data("current_bin_name")) || check_if_not_empty(get_bin_data("current_bin_key")))
    {
        decrypt_bin();
    }

    else
    {
        play_sound("error");
    }
}

function get_bin_data(specified_data)
{
    let current_bin_name = document.getElementById("bin-name").value;
    let current_bin_key = document.getElementById("bin-key").value;
    let current_bin_data = document.getElementById("bin-content").value;

    let current_bin_name_hashed = cryptoJS.SHA256(current_bin_name).toString();
    let current_bin_key_hashed = cryptoJS.SHA256(current_bin_key).toString();

    switch(specified_data)
    {
        case "current_bin_name":
            return current_bin_name;
        
        case "current_bin_key":
            return current_bin_key;

        case "current_bin_data":
            return current_bin_data;

        case "current_bin_name_hashed":
            return current_bin_name_hashed;

        case "current_bin_key_hashed":
            return current_bin_key_hashed;
    }
}

function encrypt_bin()
{
    let bin_data = {
        "bin_data": get_bin_data("current_bin_data"),
        "bin_signature": current_logged_user,
        "bin_signature_uuid": current_logged_user_uuid
    }

    let json_data = JSON.stringify(bin_data)
    let encrypted_json_data = cryptoJS.AES.encrypt(json_data, get_bin_data("current_bin_key_hashed"));

    try 
    {
        fs.writeFileSync(cryptodot_bin_data_path + get_bin_data("current_bin_name_hashed"), encrypted_json_data);

        play_sound("success");
    } 

    catch (err)
    {
        console.error(err);

        play_sound("error");
    }
}

function decrypt_bin()
{
    fs.readFile(cryptodot_bin_data_path + get_bin_data("current_bin_name_hashed"), 'utf8', (err, encrypted_data) => {
        if (err) {
            //console.log("File read failed:", err);
            //console.log("Decryption failed! invalid file name.")
            play_sound("error");
            return;
        }

        try 
        {
            let decrypted_data = cryptoJS.AES.decrypt(encrypted_data, get_bin_data("current_bin_key_hashed")).toString(cryptoJS.enc.Utf8);
            let data = JSON.parse(decrypted_data);


            document.getElementById("bin-content").value = data.bin_data;
            document.getElementById("bin-signature").value = data.bin_signature;
            document.getElementById("bin-signature-uuid").value = data.bin_signature_uuid;

            play_sound("success");
        } 

        catch (error) 
        {
            //console.log("Decryption failed!");
            play_sound("error");
        } 
    })
}

function check_if_not_empty(parameter1)
{
    if(parameter1 === "")
    {
        //console.log("Empty");

        return false;
    }

    else
    {
        //console.log("Not empty");

        return true;
    }
}

function play_sound(parameter1)
{
    let audio_success = new Audio("./resources/sounds/among_us_task_complete.wav");
    let audio_error = new Audio("./resources/sounds/among_us_crisis.wav");

    switch(parameter1)
    {
        case "success":
            audio_success.play();
            break;

        case "error":
            audio_error.play();
            break;
    }
}

//Starting Coast 1.1 stuff

const routes = {
    'index': () => {
        document.getElementById("navbar").style.display = "none";
        document.getElementById("page-title").style.marginBottom = "160px";
    },
    'main-page': () => {
        document.getElementById("main-page-username").innerHTML = current_logged_user;
        document.getElementById("navbar").style.display = "flex";
    },

    'cryptography-page': () =>{
        document.getElementById("navbar").style.marginBottom = "70px";
        document.getElementById("copyright-text").style.display = "none";

        document.getElementById("bin-content").value = "";
        document.getElementById("bin-signature").value = "";
        document.getElementById("bin-signature-uuid").value = "";
    },

    'gatekeeper': () => {
        document.getElementById("navbar").style.display = "none";
    }
};

Coast.onRouteChanged = function() {
    const current_route_name = Coast.getCurrentRoute();

    if(current_route_name != "cryptography-page")
    {
        document.getElementById("copyright-text").style.display = "block";
    }

    if(current_route_name != "index")
    {
        document.getElementById("page-title").style.marginBottom = "0px";

        gatekeeper();
    }

    if(current_route_name != "gatekeeper")
    {
        play_sound("success");
    }
}

Coast.registerRoutes(routes);