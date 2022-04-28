const express = require('express')
const path = require('path')
const Rollbar = require('rollbar')

// include and initialize the rollbar library with your access token

let rollbar = new Rollbar({
    accessToken: '42faef5956d04c1fb821f153417c8ff9',
    captureUncaught: true,
    captureUnhandledRejections: true,
  })
  
  // record a generic message and send it to Rollbar
  rollbar.log('Hello world!')

const app = express()

app.use(express.json())
app.use('/style', express.static('./styles.css'))



let student = []

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../index.html'))
    rollbar.info('html file served correctly')
})

app.post('/api/student', (req, res)=>{
    let {name} = req.body
    name = name.trim()

    const index = students.findIndex(studentName=> studentName === name)

    if(index === -1 && name !== ''){
        students.push(name)
        rollbar.log('Student added successfully', {author: 'Sumaya', type: 'manual entry'})
        res.status(200).send(students)
    } else if (name === ''){
        rollbar.error('No name given')
        res.status(400).send('must provide a name.')  
    } else {
        rollbar.error('student already exists')
        res.status(400).send('that student already exists')
    }
})


const port = process.env.PORT || 4545

app.use(rollbar.errorHandler())

app.listen(port, () => console.log(`Running on ${port}.`))

