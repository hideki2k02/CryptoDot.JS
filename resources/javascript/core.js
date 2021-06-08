// This is a comment

const cryptoJS = require("crypto-js")
const uuid = require('uuid')

let program_cfg = {
    data_path: "./cryptodot_data/",
    auth_path: "./cryptodot_data/auth/",
    bin_path: "./cryptodot_data/bin/",

    cryptodot_iv: "43727970746f446f74",
    cryptodot_file_version: String.fromCharCode(1) // Maximum version limit: 127
}

var logged_user_var = {
    username: "",
    uuid: ""
}

function get_program_cfg(requested_data)
{
    return program_cfg[requested_data]
}

function get_user_var(requested_data)
{
    let input_username = document.getElementById("username-input").value
    let input_password = document.getElementById("password-input").value

    let user_var = {
        input_username: input_username,
        input_password: input_password,

        logged_user: logged_user_var.username,
        logged_user_uuid: logged_user_var.uuid,

        hashed_input_username: cryptoJS.SHA256(input_username).toString(),
        hashed_input_password: cryptoJS.PBKDF2(input_password, input_username, { keySize: 256 / 32 } ).toString()
    }

    return user_var[requested_data]
}

function get_bin_var(requested_data)
{
    let current_bin_name = document.getElementById("bin-name").value
    let current_bin_key = document.getElementById("bin-key").value
    let current_bin_text_data = document.getElementById("bin-content").value
    let current_bin_key_hashed = cryptoJS.PBKDF2(current_bin_key, current_bin_name, { keySize: 256 / 32 }).toString()

    let bin_var = {
        current_bin_name: current_bin_name,
        current_bin_key: current_bin_key,
        current_bin_text_data: current_bin_text_data,
    
        current_bin_name_hashed: cryptoJS.SHA256(current_bin_name).toString(),
        current_bin_key_hashed: current_bin_key_hashed,

        current_bin_file_path: get_program_cfg("bin_path") + current_bin_key_hashed
    }

    //console.log(`Current Bin Name: ${current_bin_name}`)
    //console.log(`Current Bin Key: ${current_bin_key}`)
    //console.log(`Current Bin Key Hashed: ${current_bin_key_hashed}`)
    //console.log(`Current Bin File Path: ${bin_var.current_bin_file_path}`)

    return bin_var[requested_data]
}

function check_if_not_null(input)
{
    if(input === "")
    {
        //console.log("Empty")

        return false
    }

    else
    {
        //console.log("Not empty")

        return true
    }
}

function play_sound(selected_sound)
{
    let sound_player = new Audio()

    let sound_list = {
        success: "./resources/sounds/among_us_task_complete.wav",
        error: "./resources/sounds/among_us_crisis.wav"
    }

    sound_player.src = sound_list[selected_sound]

    sound_player.play()
}   

function read_user_file()
{
    fs.readFile(get_program_cfg("auth_path") + get_user_var("hashed_input_username"), 'utf8', (err, encrypted_data) => {
        if (err)
        {
            //console.log("File read failed:", err)
            //console.log("Login failed! invalid input_username.")

            play_sound("error")
            return
        }

        try
        {
            let decrypted_data = cryptoJS.AES.decrypt(encrypted_data, get_user_var("hashed_input_password"), { iv: program_cfg.cryptodot_iv} ).toString(cryptoJS.enc.Utf8)
            let json_data = JSON.parse(decrypted_data)

            logged_user_var.username = json_data.username
            logged_user_var.uuid = json_data.uuid

            window.location.href = "#main-page"
        } 

        catch (error) 
        {
            //console.log("Decryption failed!")
            play_sound("error")
        } 
    })
}

function write_user_file()
{
    let user_data = {
        "username": get_user_var("input_username"),
        "uuid": uuid.v1()
    }

    console.log(get_program_cfg("auth_path") + get_user_var("hashed_input_username"))

    if(!fs.existsSync(get_program_cfg("auth_path") + get_user_var("hashed_input_username")))
    {
        let user_data_json = JSON.stringify(user_data)

        let encrypted_json_data = cryptoJS.AES.encrypt(user_data_json, get_user_var("hashed_input_password"), { iv: program_cfg.cryptodot_iv})
    
        try 
        {
            fs.writeFileSync(get_program_cfg("auth_path") + get_user_var("hashed_input_username"), encrypted_json_data)

            play_sound("success")
        } 
    
        catch (err)
        {
            console.error(err)
        }
    }

    else
    {
        //console.log("User already exists!")

        play_sound("error")
    }
}

function buffer_copy_padded(to, from, length)
{
    const from_length = Buffer.byteLength(from);
    const start = length - from_length;
    from.copy(to, start);
}

function fix_hex(v)
{
    return v.length % 2 === 0 ? v : "0" + v; //Inline IF
}

function hex_to_int(input)
{
    return parseInt("0x" + `${input}`)
}

function encrypt_bin()
{
    let text_data_to_encrypt = {
        bin_text_content: document.getElementById("bin-content").value,
        bin_signature: get_user_var("logged_user"),
        bin_signature_uuid: get_user_var("logged_user_uuid")
    }

    let encrypted_text_data = cryptoJS.AES.encrypt(JSON.stringify(text_data_to_encrypt), get_bin_var("current_bin_key_hashed"), { iv: program_cfg.cryptodot_iv} )
    let encrypted_text_string = encrypted_text_data.toString()

    let encrypted_text_string_len_hex = encrypted_text_string.length.toString(16)

    let encrypted_text_size_buffer = Buffer.alloc(6, "00", "hex");
    const enc_size_length_buffer = Buffer.from(fix_hex(encrypted_text_string_len_hex), "hex");
    buffer_copy_padded(encrypted_text_size_buffer, enc_size_length_buffer, 6);

    let bin_content = [
        {
            data_name: "bin_file_type",
            data_encoding: "utf8",
            data: "CryptoDot"
        },
        {
            data_name: "bin_file_version",
            data_encoding: "binary",
            data: get_program_cfg("cryptodot_file_version")
        },
        {
            data_name: "bin_encrypted_text_size",
            data_encoding: "utf8",
            data: encrypted_text_size_buffer
        }, 
        {
            data_name: "bin_text_data",
            data_encoding: "utf8",
            data: encrypted_text_string
        },
    ]

    console.log(`Encrypted Text Data Buffer: ${bin_content[2].data}`)

    let wstream = fs.createWriteStream(get_bin_var("current_bin_file_path"), "binary")

    for(array_pos = 0; array_pos < bin_content.length; array_pos++)
    {
        wstream.write(bin_content[array_pos].data, bin_content[array_pos].data_encoding)

        if(array_pos < bin_content.length - 1)
        {
            wstream.write(".")
        }
    }

    wstream.end()

    play_sound("success")
}

function decrypt_bin()
{
    let current_bin_file = get_bin_var("current_bin_file_path")

    let file_header_data = []
    let file_header_readstream = fs.createReadStream(current_bin_file, { end: 17, encoding: "hex" } )

    file_header_readstream.on("data", chunk => {
        file_header_data.push(chunk)
    })

    file_header_readstream.on("end", function() {
        let file_header_array = Buffer.from(file_header_data.join(), "hex").toString("hex").split("2e")

        console.log(`Header Splitted into Array:`)
        console.log(file_header_array)

        let header_format = Buffer.from(file_header_array[0], "hex").toString()
        let header_format_version = hex_to_int(file_header_array[1])
        let header_encrypted_bin_text_size = hex_to_int(file_header_array[2])
        
        console.log(`Header File Format: ${header_format}`)
        console.log(`File Format Version: ${header_format_version}`)
        console.log(`Bin Encrypted Text Size: ${header_encrypted_bin_text_size}`)

        console.log("file_header_readstream operation has ended")

        // Start Decryption

        let bin_encrypted_text_data = ""

        let bin_encrypted_text_readstream = fs.createReadStream(current_bin_file, { 
            start: 19, 
            end: 19 + header_encrypted_bin_text_size
        })

        bin_encrypted_text_readstream.on("readable", function() {
            let chunk

            while(null !== (chunk = bin_encrypted_text_readstream.read()))
            {
                console.log("Adding chunk to bin_encrypted_text_data")
                console.log(`Chunk Buffer: ${chunk}`)
                console.log(`Chunk Size: ${chunk.length}`)

                bin_encrypted_text_data += chunk.toString()
            }
        })

        bin_encrypted_text_readstream.on("end", function() {
            console.log("Encrypted Text Readstream has ended!")
            console.log(`Text Encrypted Data: ${bin_encrypted_text_data}`)

            try
            {
                console.log("Attempting to Decrypt Data...")
                
                let decrypted_data = cryptoJS.AES.decrypt(bin_encrypted_text_data, get_bin_var("current_bin_key_hashed"), { iv: program_cfg.cryptodot_iv} )

                console.log(`Data: ${decrypted_data.toString(cryptoJS.enc.Utf8)}`)

                let data = JSON.parse(decrypted_data.toString(cryptoJS.enc.Utf8))
        
                document.getElementById("bin-content").value = data.bin_text_content;
                document.getElementById("bin-signature").value = data.bin_signature;
                document.getElementById("bin-signature-uuid").value = data.bin_signature_uuid;
        
                play_sound("success");
            }
        
            catch (error) 
            {
                console.log(error)
                //console.log("Decryption failed!");
                play_sound("error");
            } 
        })
    })
}