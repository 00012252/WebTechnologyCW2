const express=require('express');
const sqlite3 = require('sqlite3').verbose();
const app=express();
const PORT=process.env.PORT || 5000;

const db=new sqlite3.Database("./Database/tasks.db",sqlite3.OPEN_READWRITE,(err) =>{
    if(err) throw err;
    else console.log("Connection was sucessful to the Database!");
})
let sqlQuery;

// Table creation
// db.run("CREATE TABLE task (Id INTEGER PRIMARY KEY, tasks NVARCHAR(30), completed INTEGER)");
// DROP table
// db.run("DROP TABLE task")

// db.run("INSERT INTO task(tasks) VALUES (?)",["Task 2"],(err)=>{
    // if(err) throw err;

//     console.log("1 Row has been added");
// })

// db.all("SELECT * FROM task",[],(err,rows)=>{
//     if(err) throw err;


//     rows.forEach(row => {
//         console.log(row);
//     });

// })

app.use("/static", express.static("public"))
app.set("view engine","pug")
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{

res.render("home");

})


app.get('/tasks',(req,res)=>{
    sqlQuery="SELECT * from task WHERE completed=0";
    db.all(sqlQuery,[],(err,data)=>{
        if(err) throw err;


        console.log(data);
        res.render("tasks",{tasks:data})
    })

    })


app.get("/tasks/create",(req,res)=>{

    res.render("create");
})

app.post("/tasks/create",(req,res)=>{
    const FormData=req.body;

    if(FormData.task.length===0)
     {
        res.render("create",{error:true})
     }

     else if(FormData.task.length<3){
        
        res.render("create",{errorLength:true})
     }
    else{
    db.run("INSERT INTO task(tasks,completed) VALUES (?,?)",[FormData.task,0],(err)=>{
    if(err) throw err;

    console.log("1 Row has been added");

    res.render("create",{success:true})

})
    }

})






app.listen(PORT, (err)=>{
    if(err) throw err;


    console.log("This App is listening to the Port Number "+ PORT);
})