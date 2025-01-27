const app = require('express')();
const PORT = 8080;

app.listen(
    PORT,
    () => console.log(`its alive on http://localhost:${PORT}`)
)

app.get('/test', (req, res) => {
    res.status(200).send({
        tshirts: 15,
        size: 'large'
    })
});

app.post('/tshirts/:id', (req, res) => {
    const {id} = req.params;
    const {logo} = req.body;

    if (!logo) {
        res.status(418).send({message: 'We need a logo!'})
    }

    res.send({
        tshirt: `shirt with your logo ${logo}`
    })
})