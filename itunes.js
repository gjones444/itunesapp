let pg = require('pg')
let inquirer = require('inquirer')
let dbUrl = {
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: 'testdb',
  host: 'localhost',
  port: 5432
}
let itunes_song
let listosongs = []

let pgClient = new pg.Client(dbUrl);

pgClient.connect();


inquirer.prompt([{
  type: "list",
  message: "Welcome to cmd.Tunes!",
  choices: ["Login", "Register"],
  name: "signup",
}]).then((signIn) => {
  if (signIn.signup === "Login") {
    Login()
  } else if (signIn.signup === "Register") {
    Register()
  };
})

let Register = () => {
  inquirer.prompt([{
      type: "input",
      message: "Create your username",
      name: "username"
    },
    {
      type: "input",
      message: "Enter your email",
      name: "email"
    },
    {
      type: "input",
      message: "Create your password",
      name: "password"
    }
  ]).then((regUser) => {
    pgClient.query('INSERT INTO users (username, email, password) VALUES ($1,$2,$3)', [regUser.username, regUser.email, regUser.password], (create_user_err, create_user_result) => {});
    console.log("Profile Created Successfully!")
    Login()
  })
}
let Login = () => {
  inquirer.prompt([{
      type: "input",
      message: "Enter your username",
      name: "username",
    },
    {
      type: "password",
      message: "Enter your password?",
      name: "password",
    }
  ]).then((res) => {
    let makeaChoice = () => {
      pgClient.query(`SELECT * FROM users WHERE username='${res.username}'`, function(err, choice_result) {
        if (choice_result.rows.length > 0) {
          if (choice_result.rows[0].password === res.password) {
            let market = () => {
              inquirer.prompt([{
                type: "list",
                message: "What would you like to do?",
                choices: ["Buy Song", "View Songs"],
                name: "selection"
              }]).then((resTwo) => {
                if (resTwo.selection === "View Songs") {
                  pgClient.query('SELECT songs.song_title FROM songs INNER JOIN itunes_bought_products ON itunes_bought_products.song_id=songs.id WHERE itunes_bought_products.user_id=' + choice_result.rows[0].user_id, (viewErr, viewResults) => {
                    if (viewResults.rows.length > 0) {
                      for (let i = 0; i < viewResults.rows.length; i++) {
                        console.log((i + 1) + ". " + viewResults.rows[i].song_title)
                      }
                      market();
                    } else {
                      console.log("No Purchased Songs; Choose 'Buy Song' to add a song to your libray");
                      market();
                    }
                  });
                } else {
                  pgClient.query("SELECT * FROM songs", (songlistErr, songlistResults) => {
                    songlistResults.rows.forEach((catalog) => {
                      listosongs.push(catalog.song_title);
                    })
                    inquirer.prompt([{
                      type: "list",
                      message: "Select a Song",
                      choices: listosongs,
                      name: "songSelected"
                    }]).then((itunes) => {
                      songlistResults.rows.forEach((catalog) => {
                        if (catalog.song_title === itunes.songSelected) {
                          itunes_song = catalog.id
                        }
                      })
                      pgClient.query("INSERT INTO itunes_bought_products (user_id, song_id) VALUES ($1,$2)", [choice_result.rows[0].user_id, itunes_song], (boughtErr, boughtRes) => {
                        console.log("Thank you for your purchase! Your Song Was Added To Your Library!")
                        market()
                      })
                    })
                  })
                }
              })
            }
            market()
          } else {
            console.log('Incorrect Password; Try Again')
            Login()
          }
        } else {
          console.log("Username does not exist; Please register")
          Register()
        }
      })
    }
    makeaChoice()
  })
}
