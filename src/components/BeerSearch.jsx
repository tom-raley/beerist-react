import React, { Component } from 'react'

class BeerSearch extends Component {
  render () {
   return <div>
                <form id="beerForm1">
                  <input type="text" className="input beername controls" id="pac-input" placeholder="Enter brewery and beer name" />
                  <input type="text" className="input username controls" id="pac-input" placeholder="Enter your Untappd username" />
                  <input type="submit" className="addBtn" id="searchButton" value="Search" />
                </form>
                <h2 id="ratingText"></h2>
              </div>
  }
}

export default BeerSearch