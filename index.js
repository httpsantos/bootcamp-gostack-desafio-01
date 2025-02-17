const express = require('express');
const server = express();
server.use(express.json());

const projects = [{ id: "1", title: "Novo projeto", tasks: [] }]

// Deve logar toda requisicao ao servidor
// meddlewares global
server.use((req, res, next) => {
    console.time('Request');
    console.log(`Metodo de log ${req.method}; URL ${req.url}`);
    return next();
});

// Deve retornar todos os projetos guardados em memoria
server.get('/projects', (req, res) => {
    return res.json(projects);
});

// Deve retonar o projeto do id especificado na URL
server.get('/projects/:id', checkUserExists, (req, res) => {
    const { id } = req.params;
    var project = BuscaProjetoPorId(id);

    return res.json(project);
});

// Deve criar um novo projeto
server.post('/projects', (req, res) => {
    const { id, title } = req.body;
    const project = {
        id,
        title,
        task: []
    }
    projects.push(project);

    return res.json(project);
});

// Deve recer o id do projeto e o titulo da nova task em seguida editar o projeto
server.put('/projects/:id/tasks', checkUserExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    var project = BuscaProjetoPorId(id);
    project.tasks.push(title);

    return res.json(project);
});

// Deve apagar o projeto do id informado
server.delete('/projects/:id', checkUserExists, (req, res) => {
    const { id } = req.params;

    const projectIndex = BuscaIndice(id);

    projects.splice(projectIndex, 1);

    return res.send();
});

// Deve buscar o indice do projeto
function BuscaIndice(id) {
    return projects.findIndex(p => p.id == id);
}

// Deve percorrer o verto de projetos e localizar o projeto do id passado
function BuscaProjetoPorId(id) {
    var project = projects.find((element) => {
        return element.id === id;
    });
    return project;
}

// Deve verificar se o usuario informado existe
function checkUserExists(req, res, next) {
    var project = BuscaProjetoPorId(req.params.id);
    if (!project) {
        return res.status(400).json({error: 'This user id does not exists'})
    }
    return next();
}

server.listen(3000);