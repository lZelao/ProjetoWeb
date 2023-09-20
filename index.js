const express = require("express");
const app = express();
//conexão com o banco de dados importando a conexao da pasta/arquivo database
const connection = require("./database/database");
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const Pergunta = require ("./database/Pergunta");
const Resposta = require ("./database/Resposta");

connection.authenticate()
.then(() =>{
    console.log("Conexão feita com o banco de dados")
})
.catch((msgErro)=>{
    console.log(msgErro);
})



app.get("/perguntas",(req, res)=>{
    res.render("perguntas");
});
app.get("/",(req, res)=>{
    Pergunta.findAll({ raw: true, order:[
        ['id','DESC']
    ]}).then(perguntas =>{
        res.render("index",{
            perguntas : perguntas
        });
    });
    
});

app.post("/salvarperguntas",(req, res)=>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var calend = req.body.calend;
    var QuantidadePessoas = req.body.QuantidadePessoas;
    var Local = req.body.Local;
    

    Pergunta.create({
        titulo: titulo,
        descricao: descricao,
        calend: calend,
        QuantidadePessoas: QuantidadePessoas,
        Local: Local
    }).then(()=>{
        res.redirect("/");
    });

    
    });

    app.get("/pergunta/:id",(req, res)=>{
        var id = req.params.id;
        Pergunta.findOne({
            where:{ id : id}
        }).then(pergunta =>{
            if (pergunta != undefined){
                
                Resposta.findAll({
                    where: {perguntaId: pergunta.id},
                    order: [
                        ['id','DESC']
                    ]
                }).then(respostas =>{

                    res.render("pergunta",{
                        pergunta: pergunta,
                        respostas: respostas
                    
                });
            
            });
        }else{
            res.redirect("/");
        }
    });
});

app.post("/responder",(req,res) => {

    var corpo = req.body.corpo;

    var perguntaId = req.body.perguntaId;

    

    Resposta.create({

        corpo: corpo,

        perguntaId: perguntaId,

    }).then(() => {

        res.redirect("/pergunta/"+perguntaId);

    });

});

app.listen(8080,()=>{console.log("app rodando");});