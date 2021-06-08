// This is a comment
const cryptoJS = require("crypto-js");
const fs = require('fs');
const uuid = require('uuid');

let current_logged_user;
let current_logged_user_uuid;

window.onload = function WindowLoad(event) {
    if(!fs.existsSync(get_data("cryptodot_data_path"))) {
        fs.mkdirSync(get_data("cryptodot_data_path"));
    }

    if(!fs.existsSync(get_data("cryptodot_auth_data_path"))) {
        fs.mkdirSync(get_data("cryptodot_auth_data_path"));
    }

    if(!fs.existsSync(get_data("cryptodot_bin_data_path"))) {
        fs.mkdirSync(get_data("cryptodot_bin_data_path"));
    }
}

document.getElementById("login-button").onclick = function() 
{
    if(check_if_not_empty(get_data("input_username")) || check_if_not_empty(get_data("input_password")))
    {
        read_user_data_from_file()
    }

    else
    {
        play_sound("error");
    }
}

document.getElementById("register-button").onclick = function()
{
    if(check_if_not_empty(get_data("input_username")) || check_if_not_empty(get_data("input_password")))
    {
        write_user_data_file()
    }
}

document.getElementById("encrypt-bin-button").onclick = function()
{
    if(check_if_not_empty(get_data("current_bin_name")) || check_if_not_empty(get_data("current_bin_key")))
    {
        if(check_if_not_empty(get_data("current_bin_data")))
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
    if(check_if_not_empty(get_data("current_bin_name")) || check_if_not_empty(get_data("current_bin_key")))
    {
        decrypt_bin();
    }

    else
    {
        play_sound("error");
    }
}

document.getElementById("info-page").onclick = function()
{
    const { shell } = require('electron')
 
    shell.openExternal('https://www.notion.so/CryptoDot-js-f01d3bfbc1514204b79a3a336d41596c')
}

function get_data(requested_data)
{
    const cryptodot_data_path = "./cryptodot_data/";
    const cryptodot_auth_data_path = "./cryptodot_data/auth/";
    const cryptodot_bin_data_path = "./cryptodot_data/bin/";

    let input_username = document.getElementById("username-input").value;
    let input_password = document.getElementById("password-input").value;

    let current_bin_name = document.getElementById("bin-name").value;
    let current_bin_key = document.getElementById("bin-key").value;
    let current_bin_data = document.getElementById("bin-content").value;

    let hashed_input_username = cryptoJS.SHA256(input_username).toString();
    let hashed_input_password = cryptoJS.SHA512(input_password).toString();

    let current_bin_name_hashed = cryptoJS.SHA256(current_bin_name).toString();
    let current_bin_key_hashed = cryptoJS.SHA256(current_bin_key).toString();

    switch(requested_data)
    {
        case "cryptodot_data_path":
            //console.log(cryptodot_data_path);
            return cryptodot_data_path;

        case "cryptodot_auth_data_path":
            return cryptodot_auth_data_path;

        case "cryptodot_bin_data_path":
            return cryptodot_bin_data_path;

        case "input_username":
            return input_username;

        case "input_password":
            return input_password;

        case "current_bin_name":
            return current_bin_name;
        
        case "current_bin_key":
            return current_bin_key;

        case "current_bin_data":
            return current_bin_data;

        case "hashed_input_username":
            return hashed_input_username;

        case "hashed_input_password":
            return hashed_input_password;

        case "current_bin_name_hashed":
            return current_bin_name_hashed;

        case "current_bin_key_hashed":
            return current_bin_key_hashed;

        default:
            return "ERROR";
    }
}

function read_user_data_from_file()
{
    fs.readFile(get_data("cryptodot_auth_data_path") + get_data("hashed_input_username"), 'utf8', (err, encrypted_data) => {
        if (err) {
            //console.log("File read failed:", err);
            //console.log("Login failed! invalid input_username.")

            play_sound("error");
            return;
        }

        try {
            let decrypted_data = cryptoJS.AES.decrypt(encrypted_data, get_data("hashed_input_password")).toString(cryptoJS.enc.Utf8);
            let data = JSON.parse(decrypted_data);

            if(get_data("hashed_input_username") == data.hashed_username)
            {
                current_logged_user = data.input_username;
                current_logged_user_uuid = data.user_uuid;

                window.location.href = "#main-page";
            }

            else
            {
                console.log("Stop trying to crack my code!");
                gatekeeper_page();
            }

        } catch (error) {
            //console.log("Decryption failed!");
            play_sound("error");
        } 
    })
}

function write_user_data_file()
{
    if(!fs.existsSync(get_data("cryptodot_auth_data_path") + get_data("hashed_input_username")))
    {
        let user_data = {
            "input_username": get_data("input_username"),
            "hashed_username": get_data("hashed_input_username"),
            "user_uuid": uuid.v1()
        }
    
        let json_data = JSON.stringify(user_data)
        let encrypted_json_data = cryptoJS.AES.encrypt(json_data, get_data("hashed_input_password"));
    
        try 
        {
            fs.writeFileSync(get_data("cryptodot_auth_data_path") + get_data("hashed_input_username"), encrypted_json_data);

            //console.log(encrypted_json_data.toString(cryptoJS.enc.utf8));
            console.log(json_data);

            play_sound("success");
        } 
    
        catch (err)
        {
            console.error(err);
        }
    }

    else
    {
        //console.log("User already exists!");

        play_sound("error");
    }
}

function encrypt_bin()
{
    let bin_data = {
        "bin_data": get_data("current_bin_data"),
        "bin_signature": current_logged_user,
        "bin_signature_uuid": current_logged_user_uuid
    }

    let json_data = JSON.stringify(bin_data)
    let encrypted_json_data = cryptoJS.AES.encrypt(json_data, get_data("current_bin_key_hashed"));

    try 
    {
        fs.writeFileSync(get_data("cryptodot_bin_data_path") + get_data("current_bin_name_hashed"), encrypted_json_data);

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
    fs.readFile(get_data("cryptodot_bin_data_path") + get_data("current_bin_name_hashed"), 'utf8', (err, encrypted_data) => {
        if (err) {
            //console.log("File read failed:", err);
            //console.log("Decryption failed! invalid file name.")
            play_sound("error");
            return;
        }

        try 
        {
            let decrypted_data = cryptoJS.AES.decrypt(encrypted_data, get_data("current_bin_key_hashed")).toString(cryptoJS.enc.Utf8);
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

function gatekeeper_page()
{
    console.log("Warning: User not logged in");
    window.location.href = "#gatekeeper";
    play_sound("error");
}

function gatekeeper_check()
{
    let copyright_name = document.getElementById("copyright-text").innerHTML;
}

// Coast 1.1 by 10c8 thingies

const routes = {
    'index': () => {
        document.getElementById("navbar").style.display = "none";
        document.getElementById("page-title").style.marginBottom = "160px";
    },
    'main-page': () => {
        document.getElementById("main-page-username").innerHTML = current_logged_user;
        document.getElementById("navbar").style.display = "flex";
    },

    'cryptography-page-text': () =>{
        document.getElementById("copyright-text").style.display = "none";

        document.getElementById("bin-content").value = "";
        document.getElementById("bin-signature").value = "";
        document.getElementById("bin-signature-uuid").value = "";
    },

    'gatekeeper': () => {
        document.getElementById("navbar").style.display = "none";
    }
};

Coast.registerRoutes(routes);

Coast.onRouteChanged = function() {
    let current_route_name = Coast.getCurrentRoute();

    if(current_route_name != "cryptography-page-text" || current_route_name != "cryptography-page-file")
    {
        document.getElementById("copyright-text").style.display = "block";
    }

    if(current_route_name != "gatekeeper")
    {
        play_sound("success");
    }

    if(current_route_name != "index")
    {
        document.getElementById("page-title").style.marginBottom = "0px";
        gatekeeper_check();
    }
}
