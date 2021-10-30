const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

const app = express()

const url ='https://www.indeed.com/jobs?q=junior%20web%20developer&l=Remote&vjk=92343f459a8aa675'

axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const articles = []
                
            $('.jobCard_mainContent', html).each(function() {
                // const companyTitle = $(this).find('h2').text()
                const spanCount = $(this).find('h2').find('span').length
                let jobTitle = $(this).find('h2').find('span').text()
                if (spanCount === 2) {
                    jobTitle = jobTitle.slice(3) 
        
                    articles.push({
                        jobTitle
                        // companyTitle
                    }) 
                }
                    else {
                        articles.push({
                            jobTitle
                        })
                    }
                
                })
                    console.log(articles)
                }).catch(err => console.log(err))
        
                app.listen(PORT, () => console.log(`server running on port ${PORT}`) )

