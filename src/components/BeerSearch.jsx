import React, { useState } from 'react'
//import BeerText from './BeerText'

const axios = require('axios');


function BeerSearch() {
  const [beerInfo, setBeerInfo] = useState({})
  let temp = {}
  //const [inputValue, setInputValue] = useState('')
  //const [username, setUsername] = useState('')
  
  
 /*  function clearInputs() {
    setInputValue("")
    setUsername("")
  } */
  
  function handleSubmit(event) {
    event.preventDefault();
    //Run request to search beers
    axios.get("https://api.untappd.com/v4/search/beer?q=" + temp.inputValue + "&client_id=" + process.env.REACT_APP_CLIENTID + "&client_secret=" + process.env.REACT_APP_CLIENTSECRET)
      .then((res) => {
        temp.beer = res.data.response.beers.items[0].beer
        temp.brewery = res.data.response.beers.items[0].brewery.brewery_name
      })
    axios.get("https://api.untappd.com/v4/user/checkins/" + temp.username + "?client_id=" + process.env.REACT_APP_CLIENTID + "&client_secret=" + process.env.REACT_APP_CLIENTSECRET)
      .then((res) => {
        temp.beerArr = res.data.response.checkins.items
        const styleFilterArr = temp.beerArr.filter((checkin) => {
          return checkin.beer.beer_style === temp.beerSearchStyle;
        })
        const ratingArr = styleFilterArr.map((beer) => {
          return beer.rating_score;
        })
        const positiveRatingArr = ratingArr.filter((rating) => {
          return rating > 0;
        })

        if (positiveRatingArr.length > 0 && temp.username.length > 0) {
          temp.ratingAvg = positiveRatingArr.reduce((curr, acc) => {
            const total = (curr + acc) / 2
            return total
          })
          temp.ratingText = `${temp.brewery.brewery_name} ${temp.beer.beer_name} is a ${temp.beer.beer_style}. Based on your tastes, we predict a ${Math.floor(temp.ratingAvg * 20)}% chance you will like this beer!`
        } else {
          temp.ratingText = "Please enter a valid beer name and username"
        }
      })
      console.log(temp)
      setBeerInfo(temp)
}
    return <header>
                <h1>Beerist</h1>
                <h2>Will I Like This Beer?</h2>
                <form id="beerForm1" onSubmit={handleSubmit}>
                  <input 
                    type="text"
                    value={temp.inputValue}
                    //onChange={e => setBeerInfo({inputValue: e.target.value})}
                    className="input beername controls"
                    id="pac-input"
                    placeholder="Enter brewery and beer name" />
                  <input 
                    type="text"
                    value={temp.username}
                    //onChange={e => setBeerInfo({username: e.target.value})}
                    className="input username controls"
                    id="pac-input"
                    placeholder="Enter your Untappd username" />
                  <input 
                    type="submit"
                    className="addBtn"
                    id="searchButton"
                    value="Submit" />
                </form>
                <h2 id="ratingText">{beerInfo.ratingText}</h2>
                <br />
                <br />
              </header>
}

export default BeerSearch