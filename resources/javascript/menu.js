//This is a comment

const fs = require('fs');

window.onload = function WindowLoad(event) {
    if(!fs.existsSync(get_program_cfg("data_path"))) {
        fs.mkdirSync(get_program_cfg("data_path"));
    }

    if(!fs.existsSync(get_program_cfg("auth_path"))) {
        fs.mkdirSync(get_program_cfg("auth_path"));
    }

    if(!fs.existsSync(get_program_cfg("bin_path"))) {
        fs.mkdirSync(get_program_cfg("bin_path"));
    }
}

document.getElementById("login-button").onclick = function() 
{
    if(check_if_not_null(get_user_var("input_username")) || check_if_not_null(get_user_var("input_password")))
    {
        read_user_file()
    }

    else
    {
        play_sound("error");
    }
}

document.getElementById("register-button").onclick = function()
{
    //console.log("RegisterButton clicked!")

    if(check_if_not_null(get_user_var("input_username")) || check_if_not_null(get_user_var("input_password")))
    {
        write_user_file()
    }

    else
    {
        play_sound("error");
    }
}

document.getElementById("encrypt-bin-button").onclick = function()
{
    if(check_if_not_null(get_bin_var("current_bin_name")) || check_if_not_null(get_bin_var("current_bin_key")))
    {
        if(check_if_not_null(get_bin_var("current_bin_text_data")))
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
    if(check_if_not_null(get_bin_var("current_bin_name")) || check_if_not_null(get_bin_var("current_bin_key")))
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

// Coast 1.1 by 10c8 thingies

const routes = {
    'index': () => {
        document.getElementById("navbar").style.display = "none"
        document.getElementById("page-title").style.marginBottom = "160px"

        logged_user_var.username = ""
        logged_user_var.uuid = ""
    },

    'main-page': () => {
        let logged_user = get_user_var("logged_user")

        if(!check_if_not_null(logged_user))
        {
            window.location.href = "#index"
        }

        document.getElementById("main-page-username").innerHTML = logged_user
        document.getElementById("main-page-uuid").innerHTML = get_user_var("logged_user_uuid")
        document.getElementById("navbar").style.display = "flex"
    },

    'cryptography-page-text': () =>{
        document.getElementById("copyright-text").style.display = "none"

        document.getElementById("bin-content").value = ""
        document.getElementById("bin-signature").value = ""
        document.getElementById("bin-signature-uuid").value = ""
    }
}

Coast.registerRoutes(routes)

Coast.onRouteChanged = function() {
    let current_route_name = Coast.getCurrentRoute()

    if(current_route_name != "cryptography-page-text" || current_route_name != "cryptography-page-file")
    {
        document.getElementById("copyright-text").style.display = "block"
    }

    if(current_route_name != "gatekeeper")
    {
        play_sound("success")
    }

    else play_sound("error")

    if(current_route_name != "index")
    {
        document.getElementById("page-title").style.marginBottom = "0px"
    }
}