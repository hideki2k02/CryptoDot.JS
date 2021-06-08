// This is a comment

var is_logged_in = false;
var current_logged_user;
var current_logged_user_hash;
var current_logged_user_uuid;

window.onload = function WindowLoad(event) {
    if(!fs.existsSync(cryptodot_data_path)) {
        fs.mkdirSync(cryptodot_data_path);
    }

    if(!fs.existsSync(cryptodot_auth_data_path)) {
        fs.mkdirSync(cryptodot_auth_data_path);
    }

    if(!fs.existsSync(cryptodot_bin_data_path)) {
        fs.mkdirSync(cryptodot_bin_data_path);
    }
}

document.getElementById("login-button").onclick = function() 
{
    if(check_if_not_empty(get_user_input_data("input_username")) || check_if_not_empty(get_user_input_data("input_password")))
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
    if(check_if_not_empty(get_user_input_data("input_username")) || check_if_not_empty(get_user_input_data("input_password")))
    {
        write_user_data_file()
    }
}

function get_user_input_data(requested_data)
{
    let input_username = document.getElementById("username-input").value;
    let input_password = document.getElementById("password-input").value;

    let hashed_input_username = cryptoJS.SHA256(input_username).toString();
    let hashed_input_password = cryptoJS.SHA512(input_password).toString();

    switch(requested_data)
    {
        case "input_username":
            return input_username;

        case "input_password":
            return input_password;

        case "hashed_input_username":
            return hashed_input_username;

        case "hashed_input_password":
            return hashed_input_password;
    }
}

function generate_uuid()
{
    let date = new Date();

    let user_uuid_base = date.getTime();
    let user_uuid_hash = cryptoJS.SHA256(user_uuid_base).toString(cryptoJS.enc.Hex);

    return user_uuid_hash;
}

function write_user_data_file()
{
    if(!fs.existsSync(cryptodot_auth_data_path + get_user_input_data("hashed_input_username")))
    {
        let user_data = {
            "input_username": get_user_input_data("input_username"),
            "hashed_username": get_user_input_data("hashed_input_username"),
            "user_uuid": generate_uuid()
        }
    
        let json_data = JSON.stringify(user_data)
        let encrypted_json_data = cryptoJS.AES.encrypt(json_data, get_user_input_data("hashed_input_password"));
    
        try 
        {
            fs.writeFileSync(cryptodot_auth_data_path + get_user_input_data("hashed_input_username"), encrypted_json_data);

            //console.log(encrypted_json_data.toString(cryptoJS.enc.utf8));
            //console.log(json_data);

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

function read_user_data_from_file()
{
    fs.readFile(cryptodot_auth_data_path + get_user_input_data("hashed_input_username"), 'utf8', (err, encrypted_data) => {
        if (err) {
            //console.log("File read failed:", err);
            //console.log("Login failed! invalid input_username.")

            play_sound("error");
            return;
        }

        try {
            let decrypted_data = cryptoJS.AES.decrypt(encrypted_data, get_user_input_data("hashed_input_password")).toString(cryptoJS.enc.Utf8);
            let data = JSON.parse(decrypted_data);

            if(get_user_input_data("hashed_input_username") == data.hashed_username)
            {
                current_logged_user = data.input_username;
                current_logged_user_hash = data.hashed_username;
                current_logged_user_uuid = data.user_uuid;
                is_logged_in = true;

                window.location.href = "#main-page";
            }

            else
            {
                console.log("Stop trying to crack my code!");
                gatekeeper();
            }

        } catch (error) {
            //console.log("Decryption failed!");
            play_sound("error");
        } 
    })
}

function gatekeeper()
{
    if(!is_logged_in|| current_logged_user === "" || current_logged_user_hash === "")
    {
        console.log("Warning: User not logged in");
        //window.location.href = "#gatekeeper";
        play_sound("error");
    }
}