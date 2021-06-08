// This is a comment

const cryptoJS = require("crypto-js")
const uuid = require('uuid')

const cryptodot_file_version_base = 1

const program_cfg = {
    data_path: "./cryptodot_data/",
    auth_path: "./cryptodot_data/auth/",
    bin_path: "./cryptodot_data/bin/",

    cryptodot_iv: "43727970746f446f74",
    cryptodot_file_version: String.fromCharCode(cryptodot_file_version_base).padStart(2, String.fromCharCode(0x0000))
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

    //console.log(user_var.input_username)

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

            //console.log(encrypted_json_data.toString(cryptoJS.enc.utf8))
            //console.log(user_data_json)
            //console.log(get_user_var("hashed_input_password"))

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

function pad_buffer_then_concat_data(buf, len, data)
{
    const data_len = Buffer.byteLength(data);
    const start = len - data_len;
    buf.copy(data, 2);
    console.log(data);
    console
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

    let encrypted_text_data_size = Buffer.alloc(6, "00", "hex");
    const enc_size_len_buf = Buffer.from(encrypted_text_string.length.toString(16), "hex");
    pad_buffer_then_concat_data(encrypted_text_data_size, 6, enc_size_len_buf);

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
            data_name: "bin_encrypted_text_data_size",
            data_encoding: "binary",
            data: encrypted_text_data_size
        }, 
        {
            data_name: "bin_text_data",
            data_encoding: "utf8",
            data: encrypted_text_string
        },
    ]

    //console.log(bin_content[2].data)

    //fs.writeFileSync("Sick_dank_file.txt", fucking_buffer, "binary")

    //console.log(`Current Bin Data (To be Encrypted): ${text_data_to_encrypt.bin_text_content}`)
    //console.log(`Current Encrypted Text Size: ${encrypted_text_string_length}`)
    //console.log(`Encrypted Text Data: ${encrypted_text_data.toString()}`)
    console.log(`Encrypted Text Data Size: ${String.fromCharCode(bin_content[2].data)}`)
    console.log(encrypted_text_string.length.toString(16))

    let wstream = fs.createWriteStream(get_bin_var("current_bin_file_path"), "binary")

    for(array_pos = 0; array_pos < bin_content.length; array_pos++)
    {
        wstream.write(bin_content[array_pos].data, bin_content[array_pos].data_encoding)

        //console.log(`${bin_content[array_pos].data_name} Written`)

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

    let file_format = ""
    let bin_version = ""
    let bin_encrypted_text_size = 0
    let text_encrypted_data = ""

    let file_format_readstream = fs.createReadStream(current_bin_file, { end: 8 } )
    let bin_version_readstream = fs.createReadStream(current_bin_file, { start: 10, end: 11} )
    let bin_encrypted_text_size_readstream = fs.createReadStream(current_bin_file, { start: 13, end: 18} )

    file_format_readstream.on("data", chunk => {
        file_format = chunk.toString()

        console.log(`File Format: ${file_format}`)

        file_format_readstream.close()
    })

    bin_version_readstream.on("data", chunk => {
        bin_version += parseInt(chunk[0] + chunk[1])

        console.log(`Current Bin Version: ${bin_version}`)

        bin_version_readstream.close()
    })

    bin_encrypted_text_size_readstream.on("data", text_size_chunk => {
        for(size_index = 0; size_index < text_size_chunk.length; size_index++)
        {
            console.log(`Current Chunk Size: ${parseInt(text_size_chunk[size_index])}`)

            bin_encrypted_text_size += parseInt(text_size_chunk[size_index])
        }

        console.log(`Encrypted Text Total Size: ${bin_encrypted_text_size}`)
    })

    bin_encrypted_text_size_readstream.on("end", function() {
        console.log("bin_encrypted_text_size_readstream operation has ended")

        let bin_encrypted_text_readstream = fs.createReadStream(current_bin_file, { 
            start: 20, 
            end: bin_encrypted_text_size
        })

        bin_encrypted_text_readstream.on("data", chunk => {
            text_encrypted_data += chunk.toString()

            console.log("Adding chunk to text_encrypted_data")
            console.log(`Chunk Size: ${bin_encrypted_text_size}`)
            console.log(`Chunk Buffer: ${chunk}`)
        })

        bin_encrypted_text_readstream.on("end", function() {
            console.log("Encrypted Text Readstream has ended!")
            console.log(`Text Encrypted Data: ${text_encrypted_data}`)

            try
            {
                console.log("Attempting to Decrypt Data...")
                
                let decrypted_data = cryptoJS.AES.decrypt(text_encrypted_data, get_bin_var("current_bin_key_hashed"), { iv: program_cfg.cryptodot_iv} )

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