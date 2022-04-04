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

app.get("/tasks/:id/edit",(req,res)=>{
    const id=req.params.id;

    sqlQuery = `SELECT Id,tasks
           FROM task
           WHERE Id  = ?`;

    db.get(sqlQuery,[id],(err,row)=>{
        if(err) throw err;

        console.log(row);
        res.render("edit",{tasks:row,taskId:id})

    })



})

app.post("/tasks/:id/edit",(req,res)=>{
    const id=req.params.id;
    const formData=req.body;

    if(formData.tasks.length===0)
     {
        db.get("SELECT tasks FROM task where completed=0 and Id=?",[id],(err,data)=>{
            if(err) throw err;
            console.log(data);
            res.render("edit",{error:true,tasks:formData,taskId:id})

            });
       
     }
     else if(formData.tasks.length<3) {
        db.get("SELECT * FROM task where completed=0 and Id=?",[id],(err,data)=>{
            if(err) throw err;
            console.log(data);
            res.render("edit",{errorLength:true,tasks:formData,taskId:id})
    
     })
    }
     else {
    sqlQuery = `UPDATE task
    SET tasks = ?
    WHERE Id = ?`;

  db.run(sqlQuery, [formData.tasks,id], (err)=> {
    if (err) throw err;

  })

  db.all("SELECT * FROM task where completed=0",[],(err,data)=>{
    if(err) throw err;
    console.log(data);
    res.render("tasks",{tasks:data})
    
    });

     }
})



app.get("/tasks/:id/delete",(req,res)=>{
    const id=req.params.id;


    db.run("DELETE FROM task WHERE Id=?",id,err=>{
        if(err) throw err;


        console.log("Task has been deleted Successfully");
    })

    db.all("SELECT * FROM task WHERE completed=0",[],(err,data)=>{
        if(err) throw err;


        res.render("tasks",{tasks:data});

    })
        
})


app.get("/tasks/:id/completed",(req,res)=>{
    const id=req.params.id;



    db.run("UPDATE task SET completed=1 WHERE Id=?",[id],(err)=>{
        if(err) throw err;
        
        
        db.all("SELECT * from task WHERE completed=0",[],(err,data)=>{
            if(err) throw err;

            res.render("tasks",{tasks:data});

        })
    })   
        
})

app.get("/tasks/:id/uncompleted",(req,res)=>{
    const id=req.params.id;



    db.run("UPDATE task SET completed=0 WHERE Id=?",[id],(err)=>{
        if(err) throw err;
        
        
        db.all("SELECT * from task WHERE completed=1",[],(err,data)=>{
            if(err) throw err;

            res.render("completed",{tasks:data});

        })
    })   


})


app.get("/tasks/completed",(req,res)=>{

    db.all("SELECT * FROM task WHERE completed=1",[],(err,data)=>{
        if(err) throw err;


        res.render("completed",{tasks:data})


    })

})







app.listen(PORT, (err)=>{
    if(err) throw err;


    console.log("This App is listening to the Port Number "+ PORT);
})