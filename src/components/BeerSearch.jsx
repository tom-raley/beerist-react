import React, { useState } from 'react'
const axios = require('axios');

function BeerSearch() {
  const [breweryName, setBreweryName] = useState('')
  const [beerName, setBeerName] = useState('')
  const [beerSearchStyle, setBeerSearchStyle] = useState('')
  const [ratingAvg, setRatingAvg] = useState(0)
  const [ ratingText, setRatingText] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [username, setUsername] = useState('')

  function clearInputs() {
    setInputValue("")
    setUsername("")
  }
  
  function handleSubmit(event) {
    event.preventDefault();

    //Run request to search beers
    axios.get("https://api.untappd.com/v4/search/beer?q=" + inputValue + "&client_id=" + process.env.REACT_APP_CLIENTID + "&client_secret=" + process.env.REACT_APP_CLIENTSECRET)
      .then((res) => {
        if (res.data.response.beers.count === 0) {
          setRatingText("Please enter a valid brewery and beer name")
          clearInputs()
        } else {
          setBreweryName(res.data.response.beers.items[0].brewery.brewery_name)
          setBeerName(res.data.response.beers.items[0].beer.beer_name)
          setBeerSearchStyle(res.data.response.beers.items[0].beer.beer_style)
        }
      })
    
    //Run request to retrieve ratings
    axios.get("https://api.untappd.com/v4/user/checkins/" + username + "?client_id=" + process.env.REACT_APP_CLIENTID + "&client_secret=" + process.env.REACT_APP_CLIENTSECRET)
      .then((res) => {
        if(res.error_detail) {
          setRatingText("Please enter a valid Untappd username and valid search term.")
          clearInputs()
        } else {
          const beerArr = res.data.response.checkins.items
          const styleFilterArr = beerArr.filter((checkin) => {
            return checkin.beer.beer_style === beerSearchStyle;
          })
          const ratingArr = styleFilterArr.map((beer) => {
            return beer.rating_score;
          })
          const positiveRatingArr = ratingArr.filter((rating) => {
            return rating > 0;
          })

          if (positiveRatingArr.length > 0 && username.length > 0) {
            setRatingAvg(positiveRatingArr.reduce((curr, acc) => {
              const total = (curr + acc) / 2
              return total
            }))
            setRatingText(`${breweryName} ${beerName} is a ${beerSearchStyle}. Based on your tastes, we predict a ${Math.floor(ratingAvg * 20)}% chance you will like this beer!`)
          } else {
            setRatingText("Based on your entry, there's either not enough data or you didn't enter an Untappd username. We predict a 50% chance you will like this beer. Give it a try!")
          }
          clearInputs()
        }
      })
  }
  
    return <header>
                <h1>Beerist</h1>
                <h2>Will I Like This Beer?</h2>
                <form id="beerForm1" onSubmit={handleSubmit}>
                  <input 
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    className="input beername controls"
                    id="pac-input"
                    placeholder="Enter brewery and beer name" />
                  <input 
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="input username controls"
                    id="pac-input"
                    placeholder="Enter your Untappd username" />
                  <input 
                    type="submit"
                    className="addBtn"
                    id="searchButton"
                    value="Submit" />
                </form>
                <h2 id="ratingText">{ratingText}</h2>
                <br />
                <br />
              </header>
}

export default BeerSearch