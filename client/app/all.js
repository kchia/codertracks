(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React = require('react');
var DevSearchApp = require('./components/DevSearchApp.react');
var ProfilesApp = require('./components/ProfilesApp.react');

React.render(
  React.createElement(DevSearchApp, null),
  document.getElementById('devsearchapp')
);

React.render(
  React.createElement(ProfilesApp, null),
  document.getElementById('profiles')
);


},{"./components/DevSearchApp.react":5,"./components/ProfilesApp.react":15,"react":180}],2:[function(require,module,exports){
var AppDispatcher = require('../dispatcher/AppDispatcher');
var DevSearchConstants = require('../constants/DevSearchConstants');

var DevSearchActions = {

  displayData: function(input, workflow) {
    var workflowType;
    if (workflow === "countryWorkflow") {
      workflowType = "COUNTRY";
    }
    
    if (workflow === "languageWorkflow") {
      workflowType = "LANGUAGE";
    }

    if (workflow === "initialWorkflow") {
      workflowType = "INITIAL";
    }

    AppDispatcher.handleViewAction({
      actionType: "DISPLAY_" + workflowType + "_DATA",
      input: input
    });
  },

  switchWorkflow: function(workflow) {
    console.log("heard a switchWorkflow in DevSearchActions!", workflow);
      AppDispatcher.handleViewAction({
      actionType: "SWITCH_WORKFLOW",
      workflow: workflow
    }); 
  }

};

module.exports = DevSearchActions;



},{"../constants/DevSearchConstants":22,"../dispatcher/AppDispatcher":24}],3:[function(require,module,exports){
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ProfilesConstants = require('../constants/ProfilesConstants');

var ProfilesActions = {

  getCoders: function(language, country, hourlyRateMax, minScore, maxScore) {
    AppDispatcher.handleViewAction({
      actionType: 'GET_CODERS',
      language: language,
      country: country,
      hourlyRateMax: hourlyRateMax,
      minScore: minScore,
      maxScore: maxScore
    });
  },

  nextPage: function(page) {
    AppDispatcher.handleViewAction({
      actionType: 'PROFILES_NEXT_PAGE',
      page: page
    });
  }
};

module.exports = ProfilesActions;



},{"../constants/ProfilesConstants":23,"../dispatcher/AppDispatcher":24}],4:[function(require,module,exports){
var React = require('react');

var CountrySubBox = React.createClass({displayName: "CountrySubBox",

  numberWithCommas: function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  render: function() {
    var result = this.props.countrySpecificData;   
    return (
      React.createElement("div", {className: "countrysubbox"}, 
        React.createElement("h1", null, React.createElement("b", null, "Country: ")), 
        React.createElement("h1", {id: "dynamicresult"}, React.createElement("b", null, " ",  result.countryName, " ")), 
        React.createElement("h2", null, "Most Popular Languages"), 
        React.createElement("div", {class: "countryresults"}, 
          React.createElement("div", null, " 1. ",  result["topLangs"][0], ": (",  result["numDevs"][0], ")  "), 
          React.createElement("div", null, " 2. ",  result["topLangs"][1], ": (",  result["numDevs"][1], ")  "), 
          React.createElement("div", null, " 3. ",  result["topLangs"][2], ": (",  result["numDevs"][2], ")  "), 
          React.createElement("div", null, " 4. ",  result["topLangs"][3], ": (",  result["numDevs"][3], ")  "), 
          React.createElement("div", null, " 5. ",  result["topLangs"][4], ": (",  result["numDevs"][4], ")  "), 
          React.createElement("div", null, " 6. ",  result["topLangs"][5], ": (",  result["numDevs"][5], ")  "), 
          React.createElement("div", null, " 7. ",  result["topLangs"][6], ": (",  result["numDevs"][6], ")  "), 
          React.createElement("div", null, " 8. ",  result["topLangs"][7], ": (",  result["numDevs"][7], ")  "), 
          React.createElement("div", null, " 9. ",  result["topLangs"][8], ": (",  result["numDevs"][8], ")  "), 
          React.createElement("div", null, " 10. ",  result["topLangs"][9], ": (",  result["numDevs"][9], ")  ")
        ), 
        React.createElement("h3", {id: "yearlygrowth"}, React.createElement("b", null, "YoY Growth: ",  result.growthRate, "%")), 
        React.createElement("h3", null, React.createElement("b", null, "Avg. Hourly Wage: $",  result.hourlyWage, "/hr"))
      )
    );
  }
});

module.exports = CountrySubBox;


},{"react":180}],5:[function(require,module,exports){
var React = require('react');
var DevSearchStore = require('../stores/DevSearchStore');
var MainSection = require('./MainSection.react');
var Map = require('./Map.react');
var Profiles = require('./Profiles.react');
//This component operates as a "Controller-View".  It listens for changes in
//the DevSearchStore and passes the new data to its children.

//this gets the country data **as it already exists in the store** 
//this does not make a new api call to the server, only to the store.
function getDevSearchState() {
  var initialWorkflowData = DevSearchStore.getInitialWorkflowData() || {};
  var countrySpecificData = DevSearchStore.getFormattedCountryData() || {};
  var sortedCountriesByLanguageTop10 = DevSearchStore.getTop10CountriesByLanguage() || [];
  var workflow = DevSearchStore.getWorkflow();
  return {
    sortedCountriesByLanguageTop10: sortedCountriesByLanguageTop10, 
    countrySpecificData: countrySpecificData,
    initialWorkflowData: initialWorkflowData,
    workflow: workflow
  };
}

//this tells the store to make an api request for new data from the server
function requestCountrySpecificData() {
  DevSearchStore.getCountryDataFromServer();
  DevSearchStore.getDeveloperCountByCountryFromServer();
  DevSearchStore.getDeveloperCountByLanguageFromServer();
}

var DevSearchApp = React.createClass({displayName: "DevSearchApp",

  getInitialState: function() {
    requestCountrySpecificData();
    DevSearchStore.formatInitialWorkflowData();
    DevSearchStore.formatCountryData();
    DevSearchStore.sortTop10CountriesByLanguage();
    return getDevSearchState();
  },

  componentDidMount: function() {
    DevSearchStore.addChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getDevSearchState());
    //We have to force it to render after updating the state to make sure to pass the new data down to the sub components. 
    this.render();
  },

  render: function() {
  	return (
      React.createElement("div", null, 
        React.createElement(MainSection, {
          countrySpecificData: this.state.countrySpecificData, 
          sortedCountriesByLanguageTop10: this.state.sortedCountriesByLanguageTop10, 
          initialWorkflowData:  this.state.initialWorkflowData, 
          workflow: this.state.workflow})
      )
  	);
  }

});

module.exports = DevSearchApp;



},{"../stores/DevSearchStore":25,"./MainSection.react":10,"./Map.react":11,"./Profiles.react":14,"react":180}],6:[function(require,module,exports){
var React = require('react');
var ProfilesActions = require('../actions/ProfilesActions');

var HireCodersSearchBox = React.createClass({displayName: "HireCodersSearchBox",

render: function() {
    return (
      React.createElement("form", {className: "developers-search", ref: "form", onSubmit: this.handleSubmit}, 
        React.createElement("h2", null, " Find Developers "), 
        React.createElement("h3", null, " What are you looking for? "), 
        React.createElement("input", {className: "programmersearch", type: "text", placeholder: "  Enter a language...", ref: "language", list: "json-datalist"}), React.createElement("br", null), 
        React.createElement("input", {className: "programmersearch", type: "text", placeholder: "  Enter a country...", ref: "country"}), React.createElement("datalist", {id: "json-datalist"}), React.createElement("br", null), 
        React.createElement("input", {className: "programmersearch", type: "text", placeholder: "  Enter a max hourly rate...", ref: "hourlyRateMax"}), React.createElement("br", null), 
        React.createElement("select", {className: "ratingdropdown", type: "text", placeholder: "Select score", ref: "feedbackScore"}, 
          React.createElement("option", {value: "0,5"}, " Any feedback score "), 
          React.createElement("option", {value: "4.5,5"}, " 4.5 - 5.0 Stars "), 
          React.createElement("option", {value: "4,4.5"}, " 4.0 - 4.5 Stars "), 
          React.createElement("option", {value: "3,3.9"}, " 3.0 - 3.9 Stars "), 
          React.createElement("option", {value: "2,2.9"}, " 2.0 - 2.9 Stars "), 
          React.createElement("option", {value: "1,1.9"}, " 1.0 - 1.9 Stars ")
        ), 
        React.createElement("button", {className: "hireDevsButton", type: "submit"}, "Search")
      )

    );
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var language = this.refs.language.getDOMNode().value;
    var country = this.refs.country.getDOMNode().value;
    var hourlyRateMax = this.refs.hourlyRateMax.getDOMNode().value;
    var minScore = this.refs.feedbackScore.getDOMNode().value.split(',')[0];
    var maxScore = this.refs.feedbackScore.getDOMNode().value.split(',')[1];
    
    ProfilesActions.getCoders(language,country,hourlyRateMax, minScore, maxScore);
    // this.refs.language.getDOMNode().value = '';
    // this.refs.country.getDOMNode().value = '';
    // this.refs.subcategory.getDOMNode().value = '';
    // this.refs.hourlyRateMax.getDOMNode().value = '';
  }

});

module.exports = HireCodersSearchBox;



},{"../actions/ProfilesActions":3,"react":180}],7:[function(require,module,exports){
var React = require('react');
var DevSearchActions = require('../actions/DevSearchActions');
var LanguageSubBox = require('./LanguageSubBox.react');
var CountrySubBox = require('./CountrySubBox.react');
var InitialSubBox = require('./InitialSubBox.react');

var Infobox = React.createClass({displayName: "Infobox",
  
  render: function() {

		var renderedBox;
		if(this.props.workflow === "countryWorkflow"){
			renderedBox = React.createElement(CountrySubBox, {countrySpecificData:  this.props.countrySpecificData});      	
		} else if(this.props.workflow === "languageWorkflow"){
			renderedBox = React.createElement(LanguageSubBox, {sortedCountriesByLanguageTop10:  this.props.sortedCountriesByLanguageTop10});      	
		} else if(this.props.workflow === "initialWorkflow"){
      renderedBox = React.createElement(InitialSubBox, {initialWorkflowData:  this.props.initialWorkflowData});        
    }

    

  	return (
      React.createElement("section", {id: "infobox"}, 
        renderedBox, 
        React.createElement("div", {id: "hirebutton"}, React.createElement("a", {href: "#profilestitle"}, "Find Developers"))
      )
    );
  },
});

module.exports = Infobox;



},{"../actions/DevSearchActions":2,"./CountrySubBox.react":4,"./InitialSubBox.react":8,"./LanguageSubBox.react":9,"react":180}],8:[function(require,module,exports){
var React = require('react');

var InitialSubBox = React.createClass({displayName: "InitialSubBox",

  numberWithCommas: function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  render: function() {
    var result = this.props.initialWorkflowData;   
    return (
      React.createElement("div", {className: "initialsubbox"}, 
        React.createElement("h1", null, React.createElement("b", null, "Most Popular")), 
        React.createElement("h1", null, React.createElement("b", null, "Languages: World")), 
        React.createElement("h2", null, "(# Developers)"), 
        React.createElement("div", {class: "initialresults"}, 
          React.createElement("div", null, " 1.  ",  result["topTenLangs"][0][0], ":  (",  result["topTenLangs"][0][1], ")  "), 
          React.createElement("div", null, " 2.  ",  result["topTenLangs"][1][0], ": (",  result["topTenLangs"][1][1], ") "), 
          React.createElement("div", null, " 3.  ",  result["topTenLangs"][2][0], ": (",  result["topTenLangs"][2][1], ") "), 
          React.createElement("div", null, " 4.  ",  result["topTenLangs"][3][0], ": (",  result["topTenLangs"][3][1], ") "), 
          React.createElement("div", null, " 5.  ",  result["topTenLangs"][4][0], ": (",  result["topTenLangs"][4][1], ") "), 
          React.createElement("div", null, " 6.  ",  result["topTenLangs"][5][0], ": (",  result["topTenLangs"][5][1], ") "), 
          React.createElement("div", null, " 7.  ",  result["topTenLangs"][6][0], ": (",  result["topTenLangs"][6][1], ") "), 
          React.createElement("div", null, " 8.  ",  result["topTenLangs"][7][0], ": (",  result["topTenLangs"][7][1], ") "), 
          React.createElement("div", null, " 9.  ",  result["topTenLangs"][8][0], ": (",  result["topTenLangs"][8][1], ") "), 
          React.createElement("div", null, " 10. ",  result["topTenLangs"][9][0], ": (",  result["topTenLangs"][9][1], ") ")
        )
      )
    );
  }
});

module.exports = InitialSubBox;


},{"react":180}],9:[function(require,module,exports){
var React = require('react');
var DevSearchStore = require('../stores/DevSearchStore');

var getLanguageFromStore = function(){
  return DevSearchStore.getLanguage();
};

var LanguageSubBox = React.createClass({displayName: "LanguageSubBox",

  numberWithCommas: function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  render: function() {
    var count = 0;
    var language = getLanguageFromStore();
    console.log("lang", language);
  	var results = this.props.sortedCountriesByLanguageTop10;
    console.log(this.props);
    var formattedNums = results.map(function(country){
      var returnObj = {};
      console.log("Hi", count)
      returnObj.countryName = country.countryName;
      returnObj.activeProgrammers = country.activeProgrammers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      returnObj.count = ++count;
      return returnObj;
    });
    return (
      React.createElement("div", {id: "languagesubbox"}, 
        React.createElement("h1", null, React.createElement("b", null, "Language:")), 
        React.createElement("h1", {id: "dynamicresult"}, React.createElement("b", null, language)), 
        React.createElement("h2", null, "(# Developers)"), 
        React.createElement("div", null, " ", formattedNums.map(function(country) {
          return (
              React.createElement("div", null, country.count, ". ", country.countryName, ": (", country.activeProgrammers, ")")
        	);
        })
        )
      )
    );
  }

});

module.exports = LanguageSubBox;



},{"../stores/DevSearchStore":25,"react":180}],10:[function(require,module,exports){
var React = require('react');
var ReactPropTypes = React.PropTypes;
var SearchCountryBar = require('./SearchCountryBar.react');
var SearchInitialBar = require('./SearchInitialBar.react');
var SearchLanguageBar = require('./SearchLanguageBar.react');
var SelectWorkflowBar = require('./SelectWorkflowBar.react');
var DevSearchActions = require('../actions/DevSearchActions');
var Map = require('./Map.react');
var Infobox = require('./Infobox.react');

var MainSection = React.createClass({displayName: "MainSection",

  render: function() {
    var renderedSearchBar;
    if(this.props.workflow === "initialWorkflow") {
      renderedSearchBar = React.createElement(SearchInitialBar, {workflow: this.props.workflow});
    } else if(this.props.workflow === "countryWorkflow") {
      renderedSearchBar = React.createElement(SearchCountryBar, {workflow: this.props.workflow});
    } else if (this.props.workflow === "languageWorkflow") {
      renderedSearchBar = React.createElement(SearchLanguageBar, {workflow: this.props.workflow});
    }
    
    return (
      React.createElement("section", {id: "main"}, 
        React.createElement(SelectWorkflowBar, null), 
        renderedSearchBar, 
        React.createElement(Map, {
          countrySpecificData: this.props.countrySpecificData, 
          sortedCountriesByLanguageTop10: this.props.sortedCountriesByLanguageTop10, 
          initialWorkflowData:  this.props.initialWorkflowData, 
          workflow: this.props.workflow}), 
        React.createElement(Infobox, {
          countrySpecificData: this.props.countrySpecificData, 
          sortedCountriesByLanguageTop10: this.props.sortedCountriesByLanguageTop10, 
          initialWorkflowData:  this.props.initialWorkflowData, 
          workflow: this.props.workflow}), 
        React.createElement("img", {id: "codertracks-map-logo", src: "images/clients/codertracks-logo-black.png", alt: "CoderTracks Logo Black"})
      )
    );
  },

});

module.exports = MainSection;



},{"../actions/DevSearchActions":2,"./Infobox.react":7,"./Map.react":11,"./SearchCountryBar.react":16,"./SearchInitialBar.react":17,"./SearchLanguageBar.react":18,"./SelectWorkflowBar.react":19,"react":180}],11:[function(require,module,exports){
var React = require('react');
var DevSearchActions = require('../actions/DevSearchActions');
//languageColors is the object that maps from a language string to a color hex.
var languageColors = require('./languageColors'); 
var countryColors = require('./countryColors'); 
var selectedLanguage = "";
var selectedCountry = "";

var Map = React.createClass({displayName: "Map",
  callsToRender: 0,

  //Please see wiki page for more detailed information:
  //https://github.com/CulturedCheese/thesis-project/wiki/DataMaps

  drawMap: function(data) {
    if (this.props.workflow === "initialWorkflow") {
      var parsedData = {};
      var workflowData = this.props.initialWorkflowData["topLangsInCountryColors"];
      
      for(var countryCode3 in workflowData){
        parsedData[countryCode3] = workflowData[countryCode3];
      }

      console.log("parsedData");
      console.log(this.props.initialWorkflowData);

      document.getElementById('d3Map').innerHTML='';
      var map = new Datamap({
          element: document.getElementById('d3Map'),
          responsive: true,
          height: null, //if not null, datamaps will grab the height of 'element'
          width: null,
          fills: languageColors, //mapping file from language to the color code. it's a long file so we're saving it elsewhere. 
          data: parsedData,
          geographyConfig: {
            popupTemplate: function(geography, data) {
              //TODO: we should be able to make this a separate React component

              return ['<div class="hoverinfo"><strong>',
                      geography.properties.name, ': ', 
                      data.activeProgrammers, " ", 
                      data.fillKey, 
                      " Coders",
                      '</strong></div>'].join('');
            }
          }
        });
        return map; 
    } 

    if (this.props.workflow === "languageWorkflow") {
        // this.props.sortedCountriesByLanguageTop10 is a sorted array. The data property on Datamap class is expecting an object argument. 
        // Therefore, we need to parse the array of objects into an object.
        var parsedData = {};
        if (Array.isArray(data)){
          for(var i = 0; i < data.length; i++){
            var countryObj = {};
            countryObj.fillKey = data[i].formattedLanguage;
            selectedLanguage = data[i].formattedLanguage;
            countryObj.countryName = data[i].countryName;
            countryObj.activeProgrammers = data[i].activeProgrammers;
            parsedData[data[i].countryCode3] = countryObj; 
          }
        }

        document.getElementById('d3Map').innerHTML='';

        var map = new Datamap({
          element: document.getElementById('d3Map'),
          responsive: true,
          height: null, //if not null, datamaps will grab the height of 'element'
          width: null,
          geographyConfig: {
            popupOnHover: false
          },
          done: function(datamap) {
              datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                  var country = geography.properties.name;
                  alert(country.toUpperCase());
                  // DevSearchActions.displayGithubHandles(country,selectedLanguage);
              }); //allows map to be clickable
          },
          fills: languageColors, //mapping file from language to the color code. it's a long file so we're saving it elsewhere. 
          data: parsedData,  //this is the data that is attached to each country
          geographyConfig: {
            popupTemplate: function(geography, data) {
              //TODO: we should be able to make this a separate React component

              return ['<div class="hoverinfo"><strong>',
                      geography.properties.name, ': ', 
                      data.activeProgrammers, " ", 
                      data.fillKey, 
                      " Coders",
                      '</strong></div>'].join('');
            }
          }
        });
        return map; 
    } 

    if (this.props.workflow === "countryWorkflow") {
      // this.props.countrySpecificData is an object. The data property on Datamap class is expecting an object argument. 
      var parsedData = {};
      var countryObj = this.props.countrySpecificData;
      var countryCode = this.props.countrySpecificData.countryCode3;
      
      parsedData[countryCode] = countryObj;
      console.log(parsedData); 

      document.getElementById('d3Map').innerHTML='';
      var map = new Datamap({
        element: document.getElementById('d3Map'),
        responsive: true,
        height: null, //if not null, datamaps will grab the height of 'element'
        width: null,
        geographyConfig: {
          popupOnHover: false
        },
        // fills: {
        //   SELECTED: "#f1e05a"
        // },
        done: function(datamap) {
          datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
            var country = geography.properties.name;
            DevSearchActions.displayData(country, "countryWorkflow");
            // alert(geography.properties.name + ": "+ geography.id);
          });  //allows map to be clickable
        },
        fills: countryColors, //mapping file from language to the color code. it's a long file so we're saving it elsewhere. 
        data: parsedData  //this is the data that is attached to each country
      });
      return map;
    }
  },

  componentDidMount: function() {
    if (this.props.workflow === "languageWorkflow") {
      this.drawMap(this.props.sortedCountriesByLanguageTop10)
    }
    if (this.props.workflow === "countryWorkflow") {
      this.drawMap(this.props.countrySpecificData);
    }
    if (this.props.workflow === "initialWorkflow") {
      this.drawMap(this.props.initialWorkflowData);
    }
  },

  componentDidUpdate: function() {
    if (this.props.workflow === "languageWorkflow") {
      this.drawMap(this.props.sortedCountriesByLanguageTop10)
    }
    if (this.props.workflow === "countryWorkflow") {
      this.drawMap(this.props.countrySpecificData);
    }
    if (this.props.workflow === "initialWorkflow") {
      this.drawMap(this.props.initialWorkflowData);
    }
  },

  render: function() {
    //TODO: style the svg to be the right size. 
    //TODO: give the svg an ID.
    return(
      React.createElement("div", {id: "d3Map"})
    ); 
  }
});

module.exports = Map;



},{"../actions/DevSearchActions":2,"./countryColors":20,"./languageColors":21,"react":180}],12:[function(require,module,exports){
var React = require('react');
var ProfilesActions = require('../actions/ProfilesActions');

var NextPage = React.createClass({displayName: "NextPage",
  
  render: function() {
    return (
      React.createElement("form", {ref: "form", onSubmit: this.handleSubmit}, 
        React.createElement("button", {className: "nextPageButton", type: "submit"}, "Next")
      )
    );
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var currentPage = Number(this.props.profileData[0].page);
    ProfilesActions.nextPage(currentPage + 8);
  }

});

module.exports = NextPage;



},{"../actions/ProfilesActions":3,"react":180}],13:[function(require,module,exports){
var React = require('react');

var ProfileBox = React.createClass({displayName: "ProfileBox",

  render: function() {
    var style = {};
    var score = "n/a";
    var starSpan = React.createElement("span", {className: "glyphicon glyphicon-star", "aria-hidden": "true"});
    var locationSpan = React.createElement("span", {className: "glyphicon glyphicon-map-marker", "aria-hidden": "true"});
    var portrait = this.props.profileData.portrait; 

    if (this.props.profileData.feedback > 0) {
      score = Math.round( this.props.profileData.feedback * 100) / 100;
      if (score.toString().length === 1) {
        score = score + '.00';
      }
    }
    if (!portrait) {
      portrait = "../../images/clients/download.png";
    }
    return (
      React.createElement("div", {className: "profileThumbnail fadeIn"}, 
          React.createElement("a", {href: this.props.profileData.url}, 
            React.createElement("img", {src: portrait, alt: "image not found", className: "profilePortrait", "data-src": "holder.js/300x200"})
          ), 
          React.createElement("div", {className: "caption"}, 
            React.createElement("div", {className: "info"}, 
              React.createElement("span", {className: "name"}, this.props.profileData.name), 
              React.createElement("i", {className: "dot"}), 
              React.createElement("span", {className: "rate"}, "$", this.props.profileData.hourlyRate, "/hr")
            ), 
            React.createElement("div", {className: "title"}, this.props.profileData.title), 
            React.createElement("div", {className: "rating-location"}, 
              React.createElement("p", {className: "rating"}, starSpan, " ", score), 
              React.createElement("p", {className: "location"}, locationSpan, " ", this.props.profileData.country, " ")
            ), 
            React.createElement("p", {className: "profileDescription"}, this.props.profileData.description), 
            React.createElement(ProfileLink, {url: this.props.profileData.url})
          )
      )
    );
  }

});

var ProfileLink = React.createClass({displayName: "ProfileLink",
  render: function() {
    return (
      React.createElement("div", {className: "oDeskButton"}, 
        React.createElement("button", null, 
          React.createElement("a", {href: this.props.url, target: "_blank"}, 
          "oDesk Profile"
          )
        )
      )
    );
  }
});

module.exports = ProfileBox;



},{"react":180}],14:[function(require,module,exports){
var React = require('react');
var ProfileBox = require('./ProfileBox.react');
var HireCodersSearchBox = require('./HireCodersSearchBox.react');
var NextPage = require('./NextPage.react');

var Profiles = React.createClass({displayName: "Profiles",

  render: function() {
  	var results = this.props.profileData;
	    return (
	      React.createElement("section", {className: "profiles"}, 
          React.createElement(HireCodersSearchBox, null), 
          React.createElement("div", {className: "profileBoxes"}, 
            results.map(function(result) {
              return React.createElement(ProfileBox, {profileData: result});
            })
          ), 
          React.createElement(NextPage, {profileData: results})
	      )
	    );
  }

});

module.exports = Profiles;



},{"./HireCodersSearchBox.react":6,"./NextPage.react":12,"./ProfileBox.react":13,"react":180}],15:[function(require,module,exports){
var React = require('react');
var ProfilesStore = require('../stores/ProfilesStore');
var Profiles = require('./Profiles.react');

//This component operates as a "Controller-View".  It listens for changes in
//the DevSearchStore and passes the new data to its children.

//this gets the country data **as it already exists in the store** 
//this does not make a new api call to the server, only to the store.
function getProfilesState() {
  return {
    profileData: ProfilesStore.getProfileDataFromStore()
  };
}

//this tells the store to make an api request for new data from the server
function requestProfilesData() {
  ProfilesStore.getProfileDataFromServer('JavaScript', 'Vietnam', '100', 0, 5, 0);
}

var ProfilesApp = React.createClass({displayName: "ProfilesApp",

  getInitialState: function() {
    requestProfilesData();
    return getProfilesState();
  },

  componentDidMount: function() {
    ProfilesStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ProfilesStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getProfilesState());
    //We have to force it to render after updating the state to make sure to pass the new data down to the sub components. 
    this.render();
  },

  render: function() {
  	return (
      React.createElement("div", null, 
        React.createElement(Profiles, {profileData: this.state.profileData})
      )
  	);
  }

});

module.exports = ProfilesApp;



},{"../stores/ProfilesStore":26,"./Profiles.react":14,"react":180}],16:[function(require,module,exports){
var DevSearchActions = require('../actions/DevSearchActions');
var React = require('react');
var ReactPropTypes = React.PropTypes;

var SearchCountryBar = React.createClass({displayName: "SearchCountryBar",

  handleSubmit: function(e) {
    e.preventDefault();
    var input = this.refs.text.getDOMNode().value;
    var workflow = this.props.workflow;
    DevSearchActions.displayData(input, workflow);
    this.refs.text.getDOMNode().value = '';
  },

  render: function() {
    var countryList = document.getElementById('json-countrylist');
    var languageList = document.getElementById('json-languagelist');
    var autocompleteScript = document.getElementById('autocomplete');
    var body = document.getElementsByTagName('body')[0];
    var script = document.createElement('script');

    var reloadJs = function(src) {
      script.src = src;
      script.id = "autocomplete";
      // removes old script 
      if (autocompleteScript){
        autocompleteScript.remove();
      }
      // removes datalist from language workflow, if applicable
      if (languageList){
        languageList.remove();
      }
      // attaches new script and reloads it
      body.appendChild(script);
    };
    
    if (!countryList){
      reloadJs('./autocomplete.js');
    }

    return (
      React.createElement("form", {id: "searchbar", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", id: "ajax2", placeholder: "  Search by country...", list: "json-countrylist", ref: "text"}), 
        React.createElement("input", {id: "submitbutton", type: "submit", value: "Submit"}), 
        React.createElement("datalist", {id: "json-countrylist"})
      )
    );
  }

});

module.exports = SearchCountryBar;



},{"../actions/DevSearchActions":2,"react":180}],17:[function(require,module,exports){
var React = require('react');
var ReactPropTypes = React.PropTypes;

var SearchInitialBar = React.createClass({displayName: "SearchInitialBar",

  render: function() {
    return (
      React.createElement("form", {id: "searchbar", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", id: "ajax2", placeholder: "  Search...", ref: "text"}), 
        React.createElement("input", {id: "submitbutton3", type: "submit", value: "Submit"})
      )
    );
  }

});

module.exports = SearchInitialBar;



},{"react":180}],18:[function(require,module,exports){
var DevSearchActions = require('../actions/DevSearchActions');
var React = require('react');
var ReactPropTypes = React.PropTypes;

var SearchLanguageBar = React.createClass({displayName: "SearchLanguageBar",

  handleSubmit: function(e) {
    e.preventDefault();
    var input = this.refs.text.getDOMNode().value;
    var workflow = this.props.workflow;
    DevSearchActions.displayData(input, workflow);
    this.refs.text.getDOMNode().value = '';
  },

  render: function() {
    var countryList = document.getElementById('json-countrylist');
    var languageList = document.getElementById('json-languagelist');
    var autocompleteScript = document.getElementById('autocomplete');
    var body = document.getElementsByTagName('body')[0];
    var script = document.createElement('script');

    var reloadJs = function(src) {
      if (autocompleteScript){
        autocompleteScript.remove();
      }
      if (countryList){
        countryList.remove();
      }
      script.src = src;
      script.id = "autocomplete";
      body.appendChild(script);
    };

    if (!languageList){
      reloadJs('./autocomplete.js');
    }

    return (
      React.createElement("form", {id: "searchbar", onSubmit: this.handleSubmit}, 
        React.createElement("input", {type: "text", id: "ajax", placeholder: "  Search by language...", list: "json-languagelist", ref: "text"}), 
        React.createElement("input", {id: "submitbutton2", type: "submit", value: "Submit"}), 
        React.createElement("datalist", {id: "json-languagelist"})
      )
    );
  }
});

module.exports = SearchLanguageBar;



},{"../actions/DevSearchActions":2,"react":180}],19:[function(require,module,exports){
var DevSearchActions = require('../actions/DevSearchActions');
var React = require('react');
var ReactPropTypes = React.PropTypes;

var SelectWorkflowBar = React.createClass({displayName: "SelectWorkflowBar",

  handleSubmit: function(e) {
    e.preventDefault();
    var workflow = this.refs.workflow.getDOMNode().value;
    DevSearchActions.switchWorkflow(workflow);
  },

  render: function() {
    return (
      React.createElement("select", {id: "searchdropdown", onChange: this.handleSubmit, placeholder: "Search by...", ref: "workflow"}, 
        React.createElement("button", {class: "btn btn-default dropdown-toggle", placeholder: "Search by...", type: "button", id: "dropdownMenu1", "data-toggle": "dropdown", "aria-expanded": "true"}, 
          React.createElement("span", {class: "caret"})
        ), 
        React.createElement("option", {value: "initialWorkflow"}, "Search by..."), 
        React.createElement("option", {value: "languageWorkflow"}, "Programming Language"), 
        React.createElement("option", {value: "countryWorkflow"}, "Country")
      )
    );
  }

});

module.exports = SelectWorkflowBar;


},{"../actions/DevSearchActions":2,"react":180}],20:[function(require,module,exports){

var countryColors = {

    "AFG": {
        "color": "#f1e05a"
    },
    "AGO": {
        "color": "#f1e05a"
    },
    "ALB": {
        "color": "#f1e05a"
    },
    "ARE": {
        "color": "#f1e05a"
    },
    "ARG": {
        "color": "#f1e05a"
    },
    "ARM": {
        "color": "#f1e05a"
    },
    "ATA": {
        "color": "#f1e05a"
    },
    "ATF": {
        "color": "#f1e05a"
    },
    "AUS": {
        "color": "#f1e05a"
    },
    "AUT": {
        "color": "#f1e05a"
    },
    "AZE": {
        "color": "#f1e05a"
    },
    "BDI": {
        "color": "#f1e05a"
    },
    "BEL": {
        "color": "#f1e05a"
    },
    "BEN": {
        "color": "#f1e05a"
    },
    "BFA": {
        "color": "#f1e05a"
    },
    "BGD": {
        "color": "#f1e05a"
    },
    "BGR": {
        "color": "#f1e05a"
    },
    "BHS": {
        "color": "#f1e05a"
    },
    "BIH": {
        "color": "#f1e05a"
    },
    "BLR": {
        "color": "#f1e05a"
    },
    "BLZ": {
        "color": "#f1e05a"
    },
    "BOL": {
        "color": "#f1e05a"
    },
    "BRA": {
        "color": "#f1e05a"
    },
    "BRN": {
        "color": "#f1e05a"
    },
    "BTN": {
        "color": "#f1e05a"
    },
    "BWA": {
        "color": "#f1e05a"
    },
    "CAF": {
        "color": "#f1e05a"
    },
    "CAN": {
        "color": "#f1e05a"
    },
    "CHE": {
        "color": "#f1e05a"
    },
    "CHL": {
        "color": "#f1e05a"
    },
    "CHN": {
        "color": "#f1e05a"
    },
    "CIV": {
        "color": "#f1e05a"
    },
    "CMR": {
        "color": "#f1e05a"
    },
    "COD": {
        "color": "#f1e05a"
    },
    "COG": {
        "color": "#f1e05a"
    },
    "COL": {
        "color": "#f1e05a"
    },
    "CRI": {
        "color": "#f1e05a"
    },
    "CUB": {
        "color": "#f1e05a"
    },
    "CYP": {
        "color": "#f1e05a"
    },
    "CZE": {
        "color": "#f1e05a"
    },
    "DEU": {
        "color": "#f1e05a"
    },
    "DJI": {
        "color": "#f1e05a"
    },
    "DNK": {
        "color": "#f1e05a"
    },
    "DOM": {
        "color": "#f1e05a"
    },
    "DZA": {
        "color": "#f1e05a"
    },
    "ECU": {
        "color": "#f1e05a"
    },
    "EGY": {
        "color": "#f1e05a"
    },
    "ERI": {
        "color": "#f1e05a"
    },
    "ESP": {
        "color": "#f1e05a"
    },
    "EST": {
        "color": "#f1e05a"
    },
    "ETH": {
        "color": "#f1e05a"
    },
    "FIN": {
        "color": "#f1e05a"
    },
    "FJI": {
        "color": "#f1e05a"
    },
    "FLK": {
        "color": "#f1e05a"
    },
    "FRA": {
        "color": "#f1e05a"
    },
    "GUF": {
        "color": "#f1e05a"
    },
    "GAB": {
        "color": "#f1e05a"
    },
    "GBR": {
        "color": "#f1e05a"
    },
    "GEO": {
        "color": "#f1e05a"
    },
    "GHA": {
        "color": "#f1e05a"
    },
    "GIN": {
        "color": "#f1e05a"
    },
    "GMB": {
        "color": "#f1e05a"
    },
    "GNB": {
        "color": "#f1e05a"
    },
    "GNQ": {
        "color": "#f1e05a"
    },
    "GRC": {
        "color": "#f1e05a"
    },
    "GRL": {
        "color": "#f1e05a"
    },
    "GTM": {
        "color": "#f1e05a"
    },
    "GUY": {
        "color": "#f1e05a"
    },
    "HND": {
        "color": "#f1e05a"
    },
    "HRV": {
        "color": "#f1e05a"
    },
    "HTI": {
        "color": "#f1e05a"
    },
    "HUN": {
        "color": "#f1e05a"
    },
    "IDN": {
        "color": "#f1e05a"
    },
    "IND": {
        "color": "#f1e05a"
    },
    "IRL": {
        "color": "#f1e05a"
    },
    "IRN": {
        "color": "#f1e05a"
    },
    "IRQ": {
        "color": "#f1e05a"
    },
    "ISL": {
        "color": "#f1e05a"
    },
    "ISR": {
        "color": "#f1e05a"
    },
    "ITA": {
        "color": "#f1e05a"
    },
    "JAM": {
        "color": "#f1e05a"
    },
    "JOR": {
        "color": "#f1e05a"
    },
    "JPN": {
        "color": "#f1e05a"
    },
    "KAZ": {
        "color": "#f1e05a"
    },
    "KEN": {
        "color": "#f1e05a"
    },
    "KGZ": {
        "color": "#f1e05a"
    },
    "KHM": {
        "color": "#f1e05a"
    },
    "KOR": {
        "color": "#f1e05a"
    },
    "KWT": {
        "color": "#f1e05a"
    },
    "LAO": {
        "color": "#f1e05a"
    },
    "LBN": {
        "color": "#f1e05a"
    },
    "LBR": {
        "color": "#f1e05a"
    },
    "LBY": {
        "color": "#f1e05a"
    },
    "LKA": {
        "color": "#f1e05a"
    },
    "LSO": {
        "color": "#f1e05a"
    },
    "LTU": {
        "color": "#f1e05a"
    },
    "LUX": {
        "color": "#f1e05a"
    },
    "LVA": {
        "color": "#f1e05a"
    },
    "MAR": {
        "color": "#f1e05a"
    },
    "MDA": {
        "color": "#f1e05a"
    },
    "MDG": {
        "color": "#f1e05a"
    },
    "MEX": {
        "color": "#f1e05a"
    },
    "MKD": {
        "color": "#f1e05a"
    },
    "MLI": {
        "color": "#f1e05a"
    },
    "MMR": {
        "color": "#f1e05a"
    },
    "MNE": {
        "color": "#f1e05a"
    },
    "MNG": {
        "color": "#f1e05a"
    },
    "MOZ": {
        "color": "#f1e05a"
    },
    "MRT": {
        "color": "#f1e05a"
    },
    "MWI": {
        "color": "#f1e05a"
    },
    "MYS": {
        "color": "#f1e05a"
    },
    "NAM": {
        "color": "#f1e05a"
    },
    "NCL": {
        "color": "#f1e05a"
    },
    "NER": {
        "color": "#f1e05a"
    },
    "NGA": {
        "color": "#f1e05a"
    },
    "NIC": {
        "color": "#f1e05a"
    },
    "NLD": {
        "color": "#f1e05a"
    },
    "NOR": {
        "color": "#f1e05a"
    },
    "NPL": {
        "color": "#f1e05a"
    },
    "NZL": {
        "color": "#f1e05a"
    },
    "OMN": {
        "color": "#f1e05a"
    },
    "PAK": {
        "color": "#f1e05a"
    },
    "PAN": {
        "color": "#f1e05a"
    },
    "PER": {
        "color": "#f1e05a"
    },
    "PHL": {
        "color": "#f1e05a"
    },
    "PNG": {
        "color": "#f1e05a"
    },
    "POL": {
        "color": "#f1e05a"
    },
    "PRI": {
        "color": "#f1e05a"
    },
    "PRK": {
        "color": "#f1e05a"
    },
    "PRT": {
        "color": "#f1e05a"
    },
    "PRY": {
        "color": "#f1e05a"
    },
    "QAT": {
        "color": "#f1e05a"
    },
    "ROU": {
        "color": "#f1e05a"
    },
    "RUS": {
        "color": "#f1e05a"
    },
    "RWA": {
        "color": "#f1e05a"
    },
    "ESH": {
        "color": "#f1e05a"
    },
    "SAU": {
        "color": "#f1e05a"
    },
    "SDN": {
        "color": "#f1e05a"
    },
    "SSD": {
        "color": "#f1e05a"
    },
    "SEN": {
        "color": "#f1e05a"
    },
    "SLB": {
        "color": "#f1e05a"
    },
    "SLE": {
        "color": "#f1e05a"
    },
    "SLV": {
        "color": "#f1e05a"
    },
    "SOM": {
        "color": "#f1e05a"
    },
    "SRB": {
        "color": "#f1e05a"
    },
    "SUR": {
        "color": "#f1e05a"
    },
    "SVK": {
        "color": "#f1e05a"
    },
    "SVN": {
        "color": "#f1e05a"
    },
    "SWE": {
        "color": "#f1e05a"
    },
    "SWZ": {
        "color": "#f1e05a"
    },
    "SYR": {
        "color": "#f1e05a"
    },
    "TCD": {
        "color": "#f1e05a"
    },
    "TGO": {
        "color": "#f1e05a"
    },
    "THA": {
        "color": "#f1e05a"
    },
    "TJK": {
        "color": "#f1e05a"
    },
    "TKM": {
        "color": "#f1e05a"
    },
    "TLS": {
        "color": "#f1e05a"
    },
    "TTO": {
        "color": "#f1e05a"
    },
    "TUN": {
        "color": "#f1e05a"
    },
    "TUR": {
        "color": "#f1e05a"
    },
    "TWN": {
        "color": "#f1e05a"
    },
    "TZA": {
        "color": "#f1e05a"
    },
    "UGA": {
        "color": "#f1e05a"
    },
    "UKR": {
        "color": "#f1e05a"
    },
    "URY": {
        "color": "#f1e05a"
    },
    "USA": {
        "color": "#f1e05a"
    },
    "UZB": {
        "color": "#f1e05a"
    },
    "VEN": {
        "color": "#f1e05a"
    },
    "VNM": {
        "color": "#f1e05a"
    },
    "VUT": {
        "color": "#f1e05a"
    },
    "YEM": {
        "color": "#f1e05a"
    },
    "ZAF": {
        "color": "#f1e05a"
    },
    "ZMB": {
        "color": "#f1e05a"
    },
    "ZWE": {
        "color": "#f1e05a"
    }
};


var formattedColors = {};

for(var countryCode in countryColors) {  
  formattedColors[countryCode] = countryColors[countryCode].color;
}

module.exports = formattedColors;


},{}],21:[function(require,module,exports){
//TODO: capture this once so we don't need to reformat it every time.

var colors = {
    "ABAP": {
        "color": null,
        "url": "https://github.com/trending?l=ABAP"
    },
    "ActionScript": {
        "color": "#e3491a",
        "url": "https://github.com/trending?l=as3"
    },
    "Ada": {
        "color": "#02f88c",
        "url": "https://github.com/trending?l=Ada"
    },
    "Agda": {
        "color": "#467C91",
        "url": "https://github.com/trending?l=Agda"
    },
    "Alloy": {
        "color": "#cc5c24",
        "url": "https://github.com/trending?l=Alloy"
    },
    "ANTLR": {
        "color": "#9DC3FF",
        "url": "https://github.com/trending?l=ANTLR"
    },
    "Apex": {
        "color": null,
        "url": "https://github.com/trending?l=Apex"
    },
    "AppleScript": {
        "color": null,
        "url": "https://github.com/trending?l=AppleScript"
    },
    "Arc": {
        "color": "#ca2afe",
        "url": "https://github.com/trending?l=Arc"
    },
    "Arduino": {
        "color": "#bd79d1",
        "url": "https://github.com/trending?l=Arduino"
    },
    "ASP": {
        "color": "#6a40fd",
        "url": "https://github.com/trending?l=aspx-vb"
    },
    "AspectJ": {
        "color": "#1957b0",
        "url": "https://github.com/trending?l=AspectJ"
    },
    "Assembly": {
        "color": "#a67219",
        "url": "https://github.com/trending?l=nasm"
    },
    "ATS": {
        "color": "#1ac620",
        "url": "https://github.com/trending?l=ATS"
    },
    "Augeas": {
        "color": null,
        "url": "https://github.com/trending?l=Augeas"
    },
    "AutoHotkey": {
        "color": "#6594b9",
        "url": "https://github.com/trending?l=AutoHotkey"
    },
    "AutoIt": {
        "color": "#36699B",
        "url": "https://github.com/trending?l=AutoIt"
    },
    "Awk": {
        "color": null,
        "url": "https://github.com/trending?l=Awk"
    },
    "Batchfile": {
        "color": null,
        "url": "https://github.com/trending?l=bat"
    },
    "Befunge": {
        "color": null,
        "url": "https://github.com/trending?l=Befunge"
    },
    "BlitzBasic": {
        "color": null,
        "url": "https://github.com/trending?l=BlitzBasic"
    },
    "BlitzMax": {
        "color": null,
        "url": "https://github.com/trending?l=BlitzMax"
    },
    "Bluespec": {
        "color": null,
        "url": "https://github.com/trending?l=Bluespec"
    },
    "Boo": {
        "color": "#d4bec1",
        "url": "https://github.com/trending?l=Boo"
    },
    "Brainfuck": {
        "color": null,
        "url": "https://github.com/trending?l=Brainfuck"
    },
    "Brightscript": {
        "color": null,
        "url": "https://github.com/trending?l=Brightscript"
    },
    "Bro": {
        "color": null,
        "url": "https://github.com/trending?l=Bro"
    },
    "C": {
        "color": "#555",
        "url": "https://github.com/trending?l=C"
    },
    "C#": {
        "color": "#5a25a2",
        "url": "https://github.com/trending?l=csharp"
    },
    "C++": {
        "color": "#f34b7d",
        "url": "https://github.com/trending?l=cpp"
    },
    "C2hs Haskell": {
        "color": null,
        "url": "https://github.com/trending?l=C2hs Haskell"
    },
    "Ceylon": {
        "color": null,
        "url": "https://github.com/trending?l=Ceylon"
    },
    "ChucK": {
        "color": null,
        "url": "https://github.com/trending?l=ChucK"
    },
    "Cirru": {
        "color": "#aaaaff",
        "url": "https://github.com/trending?l=Cirru"
    },
    "Clean": {
        "color": "#3a81ad",
        "url": "https://github.com/trending?l=Clean"
    },
    "CLIPS": {
        "color": null,
        "url": "https://github.com/trending?l=CLIPS"
    },
    "Clojure": {
        "color": "#db5855",
        "url": "https://github.com/trending?l=Clojure"
    },
    "CMake": {
        "color": null,
        "url": "https://github.com/trending?l=CMake"
    },
    "COBOL": {
        "color": null,
        "url": "https://github.com/trending?l=COBOL"
    },
    "CoffeeScript": {
        "color": "#244776",
        "url": "https://github.com/trending?l=CoffeeScript"
    },
    "ColdFusion": {
        "color": "#ed2cd6",
        "url": "https://github.com/trending?l=cfm"
    },
    "Common Lisp": {
        "color": "#3fb68b",
        "url": "https://github.com/trending?l=Common Lisp"
    },
    "Component Pascal": {
        "color": "#b0ce4e",
        "url": "https://github.com/trending?l=Component Pascal"
    },
    "Coq": {
        "color": null,
        "url": "https://github.com/trending?l=Coq"
    },
    "Crystal": {
        "color": null,
        "url": "https://github.com/trending?l=Crystal"
    },
    "CSS": {
        "color": "#563d7c",
        "url": "https://github.com/trending?l=CSS"
    },
    "Cucumber": {
        "color": null,
        "url": "https://github.com/trending?l=Cucumber"
    },
    "Cuda": {
        "color": null,
        "url": "https://github.com/trending?l=Cuda"
    },
    "Cython": {
        "color": null,
        "url": "https://github.com/trending?l=Cython"
    },
    "D": {
        "color": "#fcd46d",
        "url": "https://github.com/trending?l=D"
    },
    "Darcs Patch": {
        "color": null,
        "url": "https://github.com/trending?l=dpatch"
    },
    "Dart": {
        "color": "#98BAD6",
        "url": "https://github.com/trending?l=Dart"
    },
    "DCPU-16 ASM": {
        "color": null,
        "url": "https://github.com/trending?l=DCPU-16 ASM"
    },
    "Diff": {
        "color": null,
        "url": "https://github.com/trending?l=Diff"
    },
    "DM": {
        "color": "#075ff1",
        "url": "https://github.com/trending?l=DM"
    },
    "Dogescript": {
        "color": "#cca760",
        "url": "https://github.com/trending?l=Dogescript"
    },
    "Dylan": {
        "color": "#3ebc27",
        "url": "https://github.com/trending?l=Dylan"
    },
    "E": {
        "color": "#ccce35",
        "url": "https://github.com/trending?l=E"
    },
    "Eagle": {
        "color": "#3994bc",
        "url": "https://github.com/trending?l=Eagle"
    },
    "eC": {
        "color": null,
        "url": "https://github.com/trending?l=ec"
    },
    "ECL": {
        "color": "#8a1267",
        "url": "https://github.com/trending?l=ECL"
    },
    "edn": {
        "color": "#db5855",
        "url": "https://github.com/trending?l=edn"
    },
    "Eiffel": {
        "color": "#946d57",
        "url": "https://github.com/trending?l=Eiffel"
    },
    "Elixir": {
        "color": "#6e4a7e",
        "url": "https://github.com/trending?l=Elixir"
    },
    "Elm": {
        "color": null,
        "url": "https://github.com/trending?l=Elm"
    },
    "Emacs Lisp": {
        "color": "#c065db",
        "url": "https://github.com/trending?l=Emacs Lisp"
    },
    "Erlang": {
        "color": "#0faf8d",
        "url": "https://github.com/trending?l=Erlang"
    },
    "F#": {
        "color": "#b845fc",
        "url": "https://github.com/trending?l=fsharp"
    },
    "Factor": {
        "color": "#636746",
        "url": "https://github.com/trending?l=Factor"
    },
    "Fancy": {
        "color": "#7b9db4",
        "url": "https://github.com/trending?l=Fancy"
    },
    "Fantom": {
        "color": "#dbded5",
        "url": "https://github.com/trending?l=Fantom"
    },
    "fish": {
        "color": null,
        "url": "https://github.com/trending?l=fish"
    },
    "FLUX": {
        "color": "#33CCFF",
        "url": "https://github.com/trending?l=FLUX"
    },
    "Forth": {
        "color": "#341708",
        "url": "https://github.com/trending?l=Forth"
    },
    "FORTRAN": {
        "color": "#4d41b1",
        "url": "https://github.com/trending?l=FORTRAN"
    },
    "Frege": {
        "color": "#00cafe",
        "url": "https://github.com/trending?l=Frege"
    },
    "Game Maker Language": {
        "color": "#8ad353",
        "url": "https://github.com/trending?l=Game Maker Language"
    },
    "GAMS": {
        "color": null,
        "url": "https://github.com/trending?l=GAMS"
    },
    "GAP": {
        "color": null,
        "url": "https://github.com/trending?l=GAP"
    },
    "GAS": {
        "color": null,
        "url": "https://github.com/trending?l=GAS"
    },
    "Genshi": {
        "color": null,
        "url": "https://github.com/trending?l=Genshi"
    },
    "Gentoo Ebuild": {
        "color": null,
        "url": "https://github.com/trending?l=Gentoo Ebuild"
    },
    "Gentoo Eclass": {
        "color": null,
        "url": "https://github.com/trending?l=Gentoo Eclass"
    },
    "Gettext Catalog": {
        "color": null,
        "url": "https://github.com/trending?l=pot"
    },
    "GLSL": {
        "color": null,
        "url": "https://github.com/trending?l=GLSL"
    },
    "Glyph": {
        "color": "#e4cc98",
        "url": "https://github.com/trending?l=Glyph"
    },
    "Gnuplot": {
        "color": "#f0a9f0",
        "url": "https://github.com/trending?l=Gnuplot"
    },
    "Go": {
        "color": "#375eab",
        "url": "https://github.com/trending?l=Go"
    },
    "Gosu": {
        "color": "#82937f",
        "url": "https://github.com/trending?l=Gosu"
    },
    "Grammatical Framework": {
        "color": "#ff0000",
        "url": "https://github.com/trending?l=Grammatical Framework"
    },
    "Groff": {
        "color": null,
        "url": "https://github.com/trending?l=Groff"
    },
    "Groovy": {
        "color": "#e69f56",
        "url": "https://github.com/trending?l=Groovy"
    },
    "Groovy Server Pages": {
        "color": null,
        "url": "https://github.com/trending?l=Groovy Server Pages"
    },
    "Harbour": {
        "color": "#0e60e3",
        "url": "https://github.com/trending?l=Harbour"
    },
    "Haskell": {
        "color": "#29b544",
        "url": "https://github.com/trending?l=Haskell"
    },
    "Haxe": {
        "color": "#f7941e",
        "url": "https://github.com/trending?l=Haxe"
    },
    "Hy": {
        "color": "#7891b1",
        "url": "https://github.com/trending?l=Hy"
    },
    "IDL": {
        "color": "#e3592c",
        "url": "https://github.com/trending?l=IDL"
    },
    "Idris": {
        "color": null,
        "url": "https://github.com/trending?l=Idris"
    },
    "Inform 7": {
        "color": null,
        "url": "https://github.com/trending?l=Inform 7"
    },
    "Inno Setup": {
        "color": null,
        "url": "https://github.com/trending?l=Inno Setup"
    },
    "Io": {
        "color": "#a9188d",
        "url": "https://github.com/trending?l=Io"
    },
    "Ioke": {
        "color": "#078193",
        "url": "https://github.com/trending?l=Ioke"
    },
    "IRC log": {
        "color": null,
        "url": "https://github.com/trending?l=irc"
    },
    "J": {
        "color": null,
        "url": "https://github.com/trending?l=J"
    },
    "Java": {
        "color": "#b07219",
        "url": "https://github.com/trending?l=Java"
    },
    "Java Server Pages": {
        "color": null,
        "url": "https://github.com/trending?l=jsp"
    },
    "JavaScript": {
        "color": "#f1e05a",
        "url": "https://github.com/trending?l=JavaScript"
    },
    "JSONiq": {
        "color": null,
        "url": "https://github.com/trending?l=JSONiq"
    },
    "Julia": {
        "color": "#a270ba",
        "url": "https://github.com/trending?l=Julia"
    },
    "Kotlin": {
        "color": null,
        "url": "https://github.com/trending?l=Kotlin"
    },
    "KRL": {
        "color": "#f5c800",
        "url": "https://github.com/trending?l=KRL"
    },
    "Lasso": {
        "color": "#2584c3",
        "url": "https://github.com/trending?l=Lasso"
    },
    "Latte": {
        "color": "#A8FF97",
        "url": "https://github.com/trending?l=Latte"
    },
    "LFE": {
        "color": "#004200",
        "url": "https://github.com/trending?l=LFE"
    },
    "LilyPond": {
        "color": null,
        "url": "https://github.com/trending?l=LilyPond"
    },
    "Literate Agda": {
        "color": null,
        "url": "https://github.com/trending?l=Literate Agda"
    },
    "Literate CoffeeScript": {
        "color": null,
        "url": "https://github.com/trending?l=litcoffee"
    },
    "Literate Haskell": {
        "color": null,
        "url": "https://github.com/trending?l=lhs"
    },
    "LiveScript": {
        "color": "#499886",
        "url": "https://github.com/trending?l=LiveScript"
    },
    "LLVM": {
        "color": null,
        "url": "https://github.com/trending?l=LLVM"
    },
    "Logos": {
        "color": null,
        "url": "https://github.com/trending?l=Logos"
    },
    "Logtalk": {
        "color": null,
        "url": "https://github.com/trending?l=Logtalk"
    },
    "Lua": {
        "color": "#fa1fa1",
        "url": "https://github.com/trending?l=Lua"
    },
    "M": {
        "color": null,
        "url": "https://github.com/trending?l=M"
    },
    "Makefile": {
        "color": null,
        "url": "https://github.com/trending?l=Makefile"
    },
    "Mako": {
        "color": null,
        "url": "https://github.com/trending?l=Mako"
    },
    "Mask": {
        "color": "#f97732",
        "url": "https://github.com/trending?l=Mask"
    },
    "Mathematica": {
        "color": null,
        "url": "https://github.com/trending?l=Mathematica"
    },
    "Matlab": {
        "color": "#bb92ac",
        "url": "https://github.com/trending?l=Matlab"
    },
    "Max": {
        "color": "#ce279c",
        "url": "https://github.com/trending?l=max/msp"
    },
    "Mercury": {
        "color": "#abcdef",
        "url": "https://github.com/trending?l=Mercury"
    },
    "MiniD": {
        "color": null,
        "url": "https://github.com/trending?l=MiniD"
    },
    "Mirah": {
        "color": "#c7a938",
        "url": "https://github.com/trending?l=ruby"
    },
    "Monkey": {
        "color": null,
        "url": "https://github.com/trending?l=Monkey"
    },
    "Moocode": {
        "color": null,
        "url": "https://github.com/trending?l=Moocode"
    },
    "MoonScript": {
        "color": null,
        "url": "https://github.com/trending?l=MoonScript"
    },
    "MTML": {
        "color": "#0095d9",
        "url": "https://github.com/trending?l=MTML"
    },
    "mupad": {
        "color": null,
        "url": "https://github.com/trending?l=mupad"
    },
    "Myghty": {
        "color": null,
        "url": "https://github.com/trending?l=Myghty"
    },
    "Nemerle": {
        "color": "#0d3c6e",
        "url": "https://github.com/trending?l=Nemerle"
    },
    "nesC": {
        "color": "#ffce3b",
        "url": "https://github.com/trending?l=nesC"
    },
    "NetLogo": {
        "color": "#ff2b2b",
        "url": "https://github.com/trending?l=NetLogo"
    },
    "Nimrod": {
        "color": "#37775b",
        "url": "https://github.com/trending?l=Nimrod"
    },
    "NSIS": {
        "color": null,
        "url": "https://github.com/trending?l=NSIS"
    },
    "Nu": {
        "color": "#c9df40",
        "url": "https://github.com/trending?l=Nu"
    },
    "NumPy": {
        "color": null,
        "url": "https://github.com/trending?l=NumPy"
    },
    "Objective-C": {
        "color": "#438eff",
        "url": "https://github.com/trending?l=Objective-C"
    },
    "Objective-C++": {
        "color": "#4886FC",
        "url": "https://github.com/trending?l=Objective-C++"
    },
    "Objective-J": {
        "color": "#ff0c5a",
        "url": "https://github.com/trending?l=Objective-J"
    },
    "OCaml": {
        "color": "#3be133",
        "url": "https://github.com/trending?l=OCaml"
    },
    "Omgrofl": {
        "color": "#cabbff",
        "url": "https://github.com/trending?l=Omgrofl"
    },
    "ooc": {
        "color": "#b0b77e",
        "url": "https://github.com/trending?l=ooc"
    },
    "Opa": {
        "color": null,
        "url": "https://github.com/trending?l=Opa"
    },
    "OpenCL": {
        "color": null,
        "url": "https://github.com/trending?l=OpenCL"
    },
    "OpenEdge ABL": {
        "color": null,
        "url": "https://github.com/trending?l=OpenEdge ABL"
    },
    "Ox": {
        "color": null,
        "url": "https://github.com/trending?l=Ox"
    },
    "Oxygene": {
        "color": "#5a63a3",
        "url": "https://github.com/trending?l=Oxygene"
    },
    "Pan": {
        "color": "#cc0000",
        "url": "https://github.com/trending?l=Pan"
    },
    "Parrot": {
        "color": "#f3ca0a",
        "url": "https://github.com/trending?l=Parrot"
    },
    "Parrot Assembly": {
        "color": null,
        "url": "https://github.com/trending?l=Parrot Assembly"
    },
    "Parrot Internal Representation": {
        "color": null,
        "url": "https://github.com/trending?l=Parrot Internal Representation"
    },
    "Pascal": {
        "color": "#b0ce4e",
        "url": "https://github.com/trending?l=Pascal"
    },
    "PAWN": {
        "color": "#dbb284",
        "url": "https://github.com/trending?l=PAWN"
    },
    "Perl": {
        "color": "#0298c3",
        "url": "https://github.com/trending?l=Perl"
    },
    "Perl6": {
        "color": "#0298c3",
        "url": "https://github.com/trending?l=Perl6"
    },
    "PHP": {
        "color": "#4F5D95",
        "url": "https://github.com/trending?l=PHP"
    },
    "Pike": {
        "color": "#066ab2",
        "url": "https://github.com/trending?l=Pike"
    },
    "PogoScript": {
        "color": "#d80074",
        "url": "https://github.com/trending?l=PogoScript"
    },
    "PowerShell": {
        "color": null,
        "url": "https://github.com/trending?l=PowerShell"
    },
    "Processing": {
        "color": "#2779ab",
        "url": "https://github.com/trending?l=Processing"
    },
    "Prolog": {
        "color": "#74283c",
        "url": "https://github.com/trending?l=Prolog"
    },
    "Propeller Spin": {
        "color": "#2b446d",
        "url": "https://github.com/trending?l=Propeller Spin"
    },
    "Puppet": {
        "color": "#cc5555",
        "url": "https://github.com/trending?l=Puppet"
    },
    "Pure Data": {
        "color": "#91de79",
        "url": "https://github.com/trending?l=Pure Data"
    },
    "PureScript": {
        "color": "#bcdc53",
        "url": "https://github.com/trending?l=PureScript"
    },
    "Python": {
        "color": "#3581ba",
        "url": "https://github.com/trending?l=Python"
    },
    "QML": {
        "color": "#44a51c",
        "url": "https://github.com/trending?l=QML"
    },
    "R": {
        "color": "#198ce7",
        "url": "https://github.com/trending?l=R"
    },
    "Racket": {
        "color": "#ae17ff",
        "url": "https://github.com/trending?l=Racket"
    },
    "Ragel in Ruby Host": {
        "color": "#ff9c2e",
        "url": "https://github.com/trending?l=Ragel in Ruby Host"
    },
    "Raw token data": {
        "color": null,
        "url": "https://github.com/trending?l=raw"
    },
    "REALbasic": {
        "color": null,
        "url": "https://github.com/trending?l=REALbasic"
    },
    "Rebol": {
        "color": "#358a5b",
        "url": "https://github.com/trending?l=Rebol"
    },
    "Red": {
        "color": "#ee0000",
        "url": "https://github.com/trending?l=Red"
    },
    "Redcode": {
        "color": null,
        "url": "https://github.com/trending?l=Redcode"
    },
    "RobotFramework": {
        "color": null,
        "url": "https://github.com/trending?l=RobotFramework"
    },
    "Rouge": {
        "color": "#cc0088",
        "url": "https://github.com/trending?l=Rouge"
    },
    "Ruby": {
        "color": "#701516",
        "url": "https://github.com/trending?l=Ruby"
    },
    "Rust": {
        "color": "#dea584",
        "url": "https://github.com/trending?l=Rust"
    },
    "Sage": {
        "color": null,
        "url": "https://github.com/trending?l=Sage"
    },
    "SAS": {
        "color": "#1E90FF",
        "url": "https://github.com/trending?l=SAS"
    },
    "Scala": {
        "color": "#7dd3b0",
        "url": "https://github.com/trending?l=Scala"
    },
    "Scheme": {
        "color": "#1e4aec",
        "url": "https://github.com/trending?l=Scheme"
    },
    "Scilab": {
        "color": null,
        "url": "https://github.com/trending?l=Scilab"
    },
    "Self": {
        "color": "#0579aa",
        "url": "https://github.com/trending?l=Self"
    },
    "Shell": {
        "color": "#5861ce",
        "url": "https://github.com/trending?l=bash"
    },
    "ShellSession": {
        "color": null,
        "url": "https://github.com/trending?l=ShellSession"
    },
    "Shen": {
        "color": "#120F14",
        "url": "https://github.com/trending?l=Shen"
    },
    "Slash": {
        "color": "#007eff",
        "url": "https://github.com/trending?l=Slash"
    },
    "Smalltalk": {
        "color": "#596706",
        "url": "https://github.com/trending?l=Smalltalk"
    },
    "Smarty": {
        "color": null,
        "url": "https://github.com/trending?l=Smarty"
    },
    "SourcePawn": {
        "color": "#f69e1d",
        "url": "https://github.com/trending?l=SourcePawn"
    },
    "Squirrel": {
        "color": null,
        "url": "https://github.com/trending?l=Squirrel"
    },
    "Standard ML": {
        "color": "#dc566d",
        "url": "https://github.com/trending?l=Standard ML"
    },
    "Stata": {
        "color": null,
        "url": "https://github.com/trending?l=Stata"
    },
    "SuperCollider": {
        "color": "#46390b",
        "url": "https://github.com/trending?l=SuperCollider"
    },
    "Swift": {
        "color": "#ffac45",
        "url": "https://github.com/trending?l=Swift"
    },
    "SystemVerilog": {
        "color": "#343761",
        "url": "https://github.com/trending?l=SystemVerilog"
    },
    "Tcl": {
        "color": "#e4cc98",
        "url": "https://github.com/trending?l=Tcl"
    },
    "Tcsh": {
        "color": null,
        "url": "https://github.com/trending?l=Tcsh"
    },
    "TeX": {
        "color": "#3D6117",
        "url": "https://github.com/trending?l=TeX"
    },
    "Turing": {
        "color": "#45f715",
        "url": "https://github.com/trending?l=Turing"
    },
    "TXL": {
        "color": null,
        "url": "https://github.com/trending?l=TXL"
    },
    "TypeScript": {
        "color": "#31859c",
        "url": "https://github.com/trending?l=TypeScript"
    },
    "Unified Parallel C": {
        "color": "#755223",
        "url": "https://github.com/trending?l=Unified Parallel C"
    },
    "UnrealScript": {
        "color": "#a54c4d",
        "url": "https://github.com/trending?l=UnrealScript"
    },
    "Vala": {
        "color": "#ee7d06",
        "url": "https://github.com/trending?l=Vala"
    },
    "VCL": {
        "color": "#0298c3",
        "url": "https://github.com/trending?l=VCL"
    },
    "Verilog": {
        "color": "#848bf3",
        "url": "https://github.com/trending?l=Verilog"
    },
    "VHDL": {
        "color": "#543978",
        "url": "https://github.com/trending?l=VHDL"
    },
    "VimL": {
        "color": "#199c4b",
        "url": "https://github.com/trending?l=vim"
    },
    "Visual Basic": {
        "color": "#945db7",
        "url": "https://github.com/trending?l=Visual Basic"
    },
    "Volt": {
        "color": "#0098db",
        "url": "https://github.com/trending?l=Volt"
    },
    "wisp": {
        "color": "#7582D1",
        "url": "https://github.com/trending?l=wisp"
    },
    "xBase": {
        "color": "#3a4040",
        "url": "https://github.com/trending?l=xBase"
    },
    "XC": {
        "color": null,
        "url": "https://github.com/trending?l=XC"
    },
    "XProc": {
        "color": null,
        "url": "https://github.com/trending?l=XProc"
    },
    "XQuery": {
        "color": "#2700e2",
        "url": "https://github.com/trending?l=XQuery"
    },
    "XS": {
        "color": null,
        "url": "https://github.com/trending?l=XS"
    },
    "XSLT": {
        "color": null,
        "url": "https://github.com/trending?l=XSLT"
    },
    "Xtend": {
        "color": null,
        "url": "https://github.com/trending?l=Xtend"
    },
    "Zephir": {
        "color": "#118f9e",
        "url": "https://github.com/trending?l=Zephir"
    },
    "Zimpl": {
        "color": null,
        "url": "https://github.com/trending?l=Zimpl"
    }
};

var formattedColors = {};

for(var language in colors) {  
  formattedColors[language] = colors[language].color;
  formattedColors[language.toLowerCase()] = colors[language].color;
}

module.exports = formattedColors;



},{}],22:[function(require,module,exports){
var keyMirror = require('keymirror');

module.exports = keyMirror({
  DEVSEARCH_TOGGLE_COMPLETE_ALL: null
});



},{"keymirror":32}],23:[function(require,module,exports){
var keyMirror = require('keymirror');

module.exports = keyMirror({
  PROFILES_NEXT_PAGE: null
});



},{"keymirror":32}],24:[function(require,module,exports){
var Dispatcher = require('flux').Dispatcher;

var copyProperties = require('react/lib/copyProperties');

var AppDispatcher = copyProperties(new Dispatcher(), {

  /**
   * @param {object} action The details of the action, including the action's
   * type and additional data coming from the view.
   */
  handleViewAction: function(action) {
    var payload = {
      source: 'VIEW_ACTION',
      action: action
    };
    console.log("here's the payload", payload);
    this.dispatch(payload);
  }

});

module.exports = AppDispatcher;







},{"flux":29,"react/lib/copyProperties":135}],25:[function(require,module,exports){
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var DevSearchConstants = require('../constants/DevSearchConstants');
var assign = require('object-assign');
var _ = require('underscore');

var CHANGE_EVENT = 'change';

// lines 10 - 12 are data from the server
var countryData = {"AND":{"2013":3,"2014":1,"fillKey":"Shell","allLangs":[["Shell",1],["Java",1]],"countryCode3":"AND","countryCode2":"AD","countryName":"Andorra","hourlyWage":0},"ARE":{"2013":72,"2014":169,"fillKey":"JavaScript","allLangs":[["JavaScript",78],["CSS",47],["Python",39],["PHP",29],["Ruby",19],["Java",19],["Objective-C",17],["C++",14],["Shell",14],["C",11],["Go",11],["C#",7],["Scala",6],["Swift",5],["CoffeeScript",5],["VimL",4],["Puppet",4],["Groovy",3],["Emacs Lisp",3],["OCaml",3],["Perl",2],["Objective-C++",2],["Prolog",1],["Erlang",1],["Racket",1],["TeX",1],["Elixir",1],["Haskell",1],["Common Lisp",1],["LiveScript",1],["TypeScript",1],["Clojure",1]],"countryCode3":"ARE","countryCode2":"AE","countryName":"United Arab Emirates","hourlyWage":0},"AFG":{"2013":5,"2014":5,"fillKey":"PHP","allLangs":[["PHP",3],["C++",2],["CSS",1],["Scala",1],["Java",1],["TeX",1],["Python",1],["JavaScript",1]],"countryCode3":"AFG","countryCode2":"AF","countryName":"Afghanistan","hourlyWage":0},"ATG":{"2013":1,"2014":3,"fillKey":"Python","allLangs":[["Python",1],["TypeScript",1],["C",1]],"countryCode3":"ATG","countryCode2":"AG","countryName":"Antigua And Barbuda","hourlyWage":7.82},"ALB":{"2013":12,"2014":26,"fillKey":"JavaScript","allLangs":[["JavaScript",13],["PHP",7],["CSS",7],["Ruby",3],["CoffeeScript",3],["Objective-C",3],["Java",3],["Python",3],["Swift",2],["Assembly",1],["Go",1],["TeX",1],["Shell",1],["C#",1],["Visual Basic",1],["Objective-C++",1],["C++",1]],"countryCode3":"ALB","countryCode2":"AL","countryName":"Albania","hourlyWage":0},"ARM":{"2013":37,"2014":80,"fillKey":"JavaScript","allLangs":[["JavaScript",37],["PHP",17],["CSS",14],["Java",12],["C++",11],["Python",7],["Ruby",6],["C#",5],["C",3],["CoffeeScript",3],["Objective-C",3],["Shell",3],["VimL",2],["Scala",2],["PowerShell",1],["Julia",1]],"countryCode3":"ARM","countryCode2":"AM","countryName":"Armenia","hourlyWage":0},"AGO":{"2013":3,"2014":9,"fillKey":"CSS","allLangs":[["CSS",4],["JavaScript",3],["Python",2],["Java",2],["Ruby",1]],"countryCode3":"AGO","countryCode2":"AO","countryName":"Angola","hourlyWage":1.84},"ATA":{"2013":7,"2014":13,"fillKey":"JavaScript","allLangs":[["JavaScript",5],["PHP",3],["CSS",3],["Shell",2],["C++",2],["C",2],["Java",2],["Ruby",2],["C#",2],["Python",1],["TypeScript",1],["Emacs Lisp",1],["Perl",1],["LSL",1],["R",1],["Thrift",1],["Lua",1]],"countryCode3":"ATA","countryCode2":"AQ","countryName":"Antarctica","hourlyWage":0},"ARG":{"2013":1071,"2014":1598,"fillKey":"JavaScript","allLangs":[["JavaScript",660],["CSS",283],["Python",281],["Java",263],["PHP",233],["Ruby",220],["Shell",141],["C",132],["C++",102],["C#",89],["CoffeeScript",72],["Objective-C",66],["Go",55],["VimL",52],["TeX",27],["Scala",27],["Perl",22],["Groovy",19],["Erlang",18],["Swift",13],["Haskell",12],["Lua",11],["R",11],["OCaml",10],["Clojure",10],["Emacs Lisp",9],["Matlab",8],["PowerShell",7],["Visual Basic",6],["ActionScript",6],["Puppet",5],["TypeScript",5],["Prolog",5],["Makefile",4],["Haxe",4],["Arduino",3],["Common Lisp",3],["Scheme",3],["Crystal",3],["Vala",3],["Smalltalk",2],["IDL",2],["MoonScript",2],["Pascal",2],["Processing",2],["Mathematica",2],["XSLT",2],["Xtend",2],["Assembly",2],["Dart",2],["GDScript",1],["LiveScript",1],["Verilog",1],["ANTLR",1],["Elixir",1],["SQF",1],["ASP",1],["OpenEdge ABL",1],["Cuda",1],["FORTRAN",1],["Tcl",1],["AppleScript",1],["PAWN",1],["Rust",1],["Standard ML",1],["Ada",1],["OpenSCAD",1]],"countryCode3":"ARG","countryCode2":"AR","countryName":"Argentina","hourlyWage":1.56},"AUT":{"2013":937,"2014":1373,"fillKey":"JavaScript","allLangs":[["JavaScript",493],["Java",282],["Python",263],["CSS",241],["PHP",214],["C",193],["Ruby",168],["C++",161],["Shell",150],["C#",91],["Objective-C",90],["Go",62],["CoffeeScript",41],["VimL",41],["TeX",31],["Scala",24],["Swift",24],["Perl",22],["Haskell",16],["Rust",14],["Dart",13],["Groovy",13],["Puppet",11],["Clojure",11],["Emacs Lisp",10],["XSLT",10],["Lua",10],["OCaml",10],["PowerShell",10],["R",9],["Erlang",8],["TypeScript",7],["Assembly",7],["Visual Basic",6],["Elixir",6],["Matlab",5],["D",5],["Arduino",5],["Processing",4],["AGS Script",4],["Makefile",3],["nesC",3],["Julia",2],["Objective-C++",2],["Standard ML",2],["AppleScript",2],["Nix",2],["Pascal",2],["Common Lisp",2],["F#",2],["SQF",1],["ANTLR",1],["AutoIt",1],["OpenSCAD",1],["FORTRAN",1],["Scheme",1],["Tcl",1],["ActionScript",1],["Mercury",1],["Pure Data",1],["Kotlin",1],["VHDL",1],["Prolog",1],["Game Maker Language",1],["Racket",1],["M",1],["Nemerle",1],["XProc",1],["Augeas",1],["Logos",1],["Max",1],["Crystal",1]],"countryCode3":"AUT","countryCode2":"AT","countryName":"Austria","hourlyWage":15.9},"AUS":{"2013":3319,"2014":4803,"fillKey":"JavaScript","allLangs":[["JavaScript",1867],["Python",921],["CSS",868],["Ruby",812],["PHP",679],["Java",545],["Shell",518],["C++",470],["C",464],["C#",448],["Objective-C",309],["Go",278],["CoffeeScript",177],["VimL",164],["Scala",108],["Perl",105],["Swift",102],["R",90],["Haskell",78],["Clojure",63],["OCaml",61],["Emacs Lisp",53],["TeX",52],["PowerShell",46],["Groovy",42],["Rust",41],["Lua",40],["Puppet",39],["Arduino",31],["TypeScript",30],["Elixir",21],["F#",19],["XSLT",17],["Visual Basic",16],["Erlang",15],["Haxe",14],["Prolog",14],["Matlab",13],["ActionScript",12],["Julia",12],["Assembly",12],["Scheme",11],["Objective-C++",10],["FORTRAN",7],["Common Lisp",7],["Processing",6],["D",6],["Makefile",6],["Game Maker Language",5],["Pascal",5],["ColdFusion",5],["Logos",5],["Dart",5],["SQF",5],["AGS Script",5],["Kotlin",4],["Mercury",4],["LiveScript",4],["IDL",4],["Forth",3],["AppleScript",3],["SQL",3],["nesC",3],["Nix",3],["OpenSCAD",3],["ASP",3],["PureScript",2],["Smalltalk",2],["Objective-J",2],["Vala",2],["Racket",2],["DOT",2],["Mathematica",2],["SourcePawn",2],["Elm",2],["AutoHotkey",2],["Crystal",2],["Standard ML",2],["VHDL",2],["AutoIt",1],["Inform 7",1],["SuperCollider",1],["XQuery",1],["Augeas",1],["Coq",1],["ANTLR",1],["AspectJ",1],["Isabelle",1],["LabVIEW",1],["M",1],["Verilog",1],["Gosu",1],["Pike",1],["Pure Data",1],["Rebol",1],["Eiffel",1],["Apex",1],["Gnuplot",1],["Lasso",1],["Tcl",1],["Frege",1],["Grammatical Framework",1]],"countryCode3":"AUS","countryCode2":"AU","countryName":"Australia","hourlyWage":25},"AZE":{"2013":13,"2014":33,"fillKey":"JavaScript","allLangs":[["JavaScript",11],["Java",10],["PHP",9],["Python",6],["CSS",5],["C++",4],["C",4],["Perl",3],["Objective-C",2],["Ruby",2],["C#",2],["Go",1],["Shell",1],["Clojure",1],["Swift",1],["Scala",1],["R",1]],"countryCode3":"AZE","countryCode2":"AZ","countryName":"Azerbaijan","hourlyWage":0},"BIH":{"2013":35,"2014":67,"fillKey":"JavaScript","allLangs":[["JavaScript",27],["PHP",15],["CSS",14],["Java",13],["Python",8],["Ruby",7],["C#",5],["Shell",4],["C",3],["Go",3],["CoffeeScript",3],["C++",2],["Perl",2],["R",1],["xBase",1],["Objective-C",1],["Puppet",1],["VimL",1],["Makefile",1],["OCaml",1],["Visual Basic",1],["Haskell",1],["Matlab",1],["ActionScript",1],["Lua",1],["Pascal",1]],"countryCode3":"BIH","countryCode2":"BA","countryName":"Bosnia & Herzegovina","hourlyWage":0},"BRB":{"2013":3,"2014":2,"fillKey":"VimL","allLangs":[["VimL",1],["CSS",1],["JavaScript",1]],"countryCode3":"BRB","countryCode2":"BB","countryName":"Barbados","hourlyWage":13.02},"BGD":{"2013":216,"2014":499,"fillKey":"JavaScript","allLangs":[["JavaScript",233],["PHP",157],["CSS",118],["Java",91],["Python",59],["C++",43],["C#",34],["Ruby",31],["Shell",30],["CoffeeScript",22],["C",18],["Objective-C",11],["Go",8],["Scala",6],["VimL",6],["Swift",5],["Groovy",4],["ActionScript",4],["OCaml",3],["R",3],["Haskell",3],["Makefile",3],["Perl",2],["TeX",2],["Lua",2],["PowerShell",2],["ASP",1],["Kotlin",1],["Visual Basic",1],["Emacs Lisp",1],["Matlab",1],["Rust",1],["Assembly",1],["TypeScript",1],["ooc",1],["Erlang",1],["Elixir",1]],"countryCode3":"BGD","countryCode2":"BD","countryName":"Bangladesh","hourlyWage":1.3},"BEL":{"2013":1119,"2014":1768,"fillKey":"JavaScript","allLangs":[["JavaScript",657],["Python",342],["PHP",326],["CSS",318],["Java",296],["Ruby",201],["Shell",186],["C++",184],["C",152],["C#",142],["Objective-C",85],["Go",84],["CoffeeScript",62],["VimL",60],["TeX",43],["R",37],["Scala",34],["Perl",33],["Swift",21],["Haskell",21],["Emacs Lisp",19],["Puppet",18],["TypeScript",17],["OCaml",16],["Clojure",16],["Arduino",13],["PowerShell",12],["Groovy",12],["Matlab",12],["Dart",11],["Lua",10],["Rust",9],["Elixir",8],["Assembly",8],["Makefile",8],["Scheme",6],["Vala",5],["Objective-C++",5],["Pan",4],["Erlang",4],["Smalltalk",4],["Kotlin",4],["Pascal",4],["XSLT",4],["Prolog",4],["Haxe",4],["Julia",4],["Common Lisp",4],["AGS Script",3],["F#",3],["Processing",3],["SQF",3],["Visual Basic",3],["AutoHotkey",2],["D",2],["Crystal",2],["ColdFusion",2],["nesC",2],["J",2],["Tcl",2],["VCL",2],["FORTRAN",2],["Racket",2],["AppleScript",2],["Delphi",1],["XProc",1],["XQuery",1],["SAS",1],["Logos",1],["Nemerle",1],["Frege",1],["Propeller Spin",1],["Inform 7",1],["DM",1],["ANTLR",1],["OpenSCAD",1],["ActionScript",1],["LiveScript",1],["Slash",1],["MoonScript",1],["Dylan",1],["PAWN",1],["SQL",1],["Nix",1],["UnrealScript",1]],"countryCode3":"BEL","countryCode2":"BE","countryName":"Belgium","hourlyWage":0},"BFA":{"2013":2,"2014":3,"fillKey":"JavaScript","allLangs":[["JavaScript",1],["C#",1],["Ruby",1],["Lua",1],["C++",1],["C",1],["PHP",1]],"countryCode3":"BFA","countryCode2":"BF","countryName":"Burkina Faso","hourlyWage":2.16},"BGR":{"2013":474,"2014":868,"fillKey":"JavaScript","allLangs":[["JavaScript",381],["C#",176],["CSS",169],["PHP",154],["Java",139],["Python",111],["C",92],["C++",87],["Ruby",81],["Shell",67],["Objective-C",39],["Go",31],["VimL",30],["CoffeeScript",27],["OCaml",13],["Swift",11],["Perl",10],["PowerShell",8],["Clojure",8],["ASP",7],["Scala",6],["TypeScript",6],["Scheme",6],["Lua",6],["Emacs Lisp",5],["Haskell",5],["ActionScript",4],["Visual Basic",4],["Makefile",3],["Rust",3],["Objective-C++",2],["Common Lisp",2],["Prolog",2],["R",2],["AutoHotkey",2],["Groovy",2],["Puppet",2],["TeX",2],["AGS Script",1],["Racket",1],["VCL",1],["D",1],["XSLT",1],["Julia",1],["AppleScript",1],["Crystal",1],["Fancy",1],["Vala",1],["Elixir",1],["Pascal",1],["Arduino",1],["Game Maker Language",1]],"countryCode3":"BGR","countryCode2":"BG","countryName":"Bulgaria","hourlyWage":2.02},"BHR":{"2013":11,"2014":14,"fillKey":"PHP","allLangs":[["PHP",6],["JavaScript",6],["CSS",5],["Java",4],["Ruby",4],["Python",3],["Shell",2],["C++",2],["Objective-C",2],["C#",1],["Go",1],["C",1]],"countryCode3":"BHR","countryCode2":"BH","countryName":"Bahrain","hourlyWage":11.04},"BDI":{"2013":1,"2014":1,"fillKey":"Python","allLangs":[["Python",1],["Ruby",1],["JavaScript",1]],"countryCode3":"BDI","countryCode2":"BI","countryName":"Burundi","hourlyWage":0},"BEN":{"2013":39,"2014":73,"fillKey":"JavaScript","allLangs":[["JavaScript",29],["Java",25],["CSS",15],["C++",15],["Python",12],["C",11],["PHP",7],["Ruby",6],["Go",6],["VimL",5],["Objective-C",5],["C#",4],["Shell",3],["CoffeeScript",2],["Scala",1],["Groovy",1],["OCaml",1],["Swift",1],["Game Maker Language",1],["Julia",1],["XSLT",1],["Perl",1],["Rust",1],["TeX",1],["R",1],["Slash",1],["Emacs Lisp",1]],"countryCode3":"BEN","countryCode2":"BJ","countryName":"Benin","hourlyWage":3.52},"BMU":{"2013":7,"2014":10,"fillKey":"JavaScript","allLangs":[["JavaScript",5],["Python",5],["Shell",5],["CSS",4],["C++",4],["CoffeeScript",2],["Ruby",2],["C#",2],["C",2],["Java",2],["Go",1],["Objective-C",1],["Erlang",1],["Haskell",1],["Perl",1],["F#",1],["Lua",1],["R",1],["Emacs Lisp",1],["PHP",1],["XSLT",1]],"countryCode3":"BMU","countryCode2":"BM","countryName":"Bermuda","hourlyWage":0},"BRN":{"2013":1,"2014":3,"fillKey":"Python","allLangs":[["Python",2],["CSS",1],["Shell",1],["JavaScript",1]],"countryCode3":"BRN","countryCode2":"BN","countryName":"Brunei Darussalam","hourlyWage":0},"BOL":{"2013":51,"2014":85,"fillKey":"JavaScript","allLangs":[["JavaScript",34],["CSS",23],["Java",14],["PHP",14],["Python",12],["Shell",10],["C++",10],["Ruby",10],["C#",7],["C",6],["Scala",3],["Objective-C",2],["Swift",2],["Groovy",2],["Lua",2],["AppleScript",1],["CoffeeScript",1],["Processing",1],["Go",1],["CLIPS",1],["D",1],["R",1],["VimL",1]],"countryCode3":"BOL","countryCode2":"BO","countryName":"Bolivia, Plurinational State Of","hourlyWage":2.36},"BRA":{"2013":2797,"2014":4441,"fillKey":"JavaScript","allLangs":[["JavaScript",1741],["Java",993],["CSS",904],["Python",751],["PHP",738],["Ruby",641],["C",464],["C++",426],["Shell",389],["C#",275],["Objective-C",177],["Go",169],["CoffeeScript",165],["VimL",129],["TeX",91],["R",57],["OCaml",53],["Lua",49],["Scala",49],["Swift",47],["Perl",46],["Groovy",32],["Emacs Lisp",27],["Clojure",25],["Haskell",25],["Rust",21],["Elixir",21],["ActionScript",19],["Assembly",19],["Arduino",18],["TypeScript",18],["PowerShell",17],["Matlab",14],["Puppet",13],["Makefile",11],["ASP",11],["Vala",9],["Visual Basic",8],["Haxe",8],["Scheme",7],["Objective-C++",7],["D",6],["Pascal",6],["Dart",5],["Erlang",5],["Kotlin",5],["XSLT",5],["Prolog",5],["FORTRAN",4],["Racket",4],["Julia",4],["Common Lisp",4],["Verilog",4],["BlitzBasic",3],["VHDL",3],["Zephir",3],["Cuda",3],["Pure Data",3],["Gosu",3],["SourcePawn",2],["PureScript",2],["OpenEdge ABL",2],["xBase",2],["Bison",2],["LiveScript",2],["AGS Script",2],["Crystal",2],["Logos",1],["Gnuplot",1],["AppleScript",1],["AutoHotkey",1],["LabVIEW",1],["Perl6",1],["AspectJ",1],["VCL",1],["PAWN",1],["Processing",1],["SAS",1],["Smalltalk",1],["Mercury",1],["OpenSCAD",1],["Elm",1],["Game Maker Language",1],["Scilab",1],["Tcl",1],["Delphi",1],["F#",1]],"countryCode3":"BRA","countryCode2":"BR","countryName":"Brazil","hourlyWage":6.36},"BHS":{"2013":1,"2014":2,"fillKey":"JavaScript","allLangs":[["JavaScript",1],["C++",1]],"countryCode3":"BHS","countryCode2":"BS","countryName":"Bahamas","hourlyWage":16},"BTN":{"2013":1,"2014":1,"fillKey":"Python","allLangs":[["Python",1],["JavaScript",1],["PHP",1]],"countryCode3":"BTN","countryCode2":"BT","countryName":"Bhutan","hourlyWage":0},"BWA":{"2013":1,"2014":4,"fillKey":"PHP","allLangs":[["PHP",3],["CSS",1],["JavaScript",1],["C++",1]],"countryCode3":"BWA","countryCode2":"BW","countryName":"Botswana","hourlyWage":0},"BLR":{"2013":619,"2014":906,"fillKey":"JavaScript","allLangs":[["JavaScript",321],["Java",181],["CSS",132],["Ruby",128],["PHP",123],["Python",101],["C#",94],["C++",93],["C",83],["Shell",59],["Objective-C",52],["Go",37],["CoffeeScript",31],["VimL",21],["Emacs Lisp",18],["Clojure",16],["Swift",15],["Scala",14],["Erlang",14],["TeX",13],["Groovy",12],["Rust",9],["PowerShell",9],["Perl",8],["Haskell",7],["OCaml",6],["ActionScript",6],["Elixir",6],["Puppet",5],["Haxe",4],["TypeScript",4],["Common Lisp",4],["Lua",3],["R",3],["VHDL",3],["Vala",2],["Assembly",2],["D",2],["F#",2],["AGS Script",2],["Racket",2],["Mathematica",2],["Dart",1],["Game Maker Language",1],["XSLT",1],["Apex",1],["Processing",1],["Julia",1],["Nimrod",1],["GAP",1],["Verilog",1],["Makefile",1],["Pascal",1],["CLIPS",1],["Visual Basic",1],["Kotlin",1],["BlitzBasic",1]],"countryCode3":"BLR","countryCode2":"BY","countryName":"Belarus","hourlyWage":0},"BLZ":{"2013":1,"2014":2,"fillKey":"JavaScript","allLangs":[["JavaScript",1],["Groovy",1],["PHP",1],["Java",1]],"countryCode3":"BLZ","countryCode2":"BZ","countryName":"Belize","hourlyWage":0},"CAN":{"2013":5396,"2014":8448,"fillKey":"JavaScript","allLangs":[["JavaScript",3436],["Python",1749],["CSS",1721],["Java",1336],["Ruby",1276],["PHP",1015],["C++",879],["C",843],["Shell",781],["C#",553],["Objective-C",512],["Go",417],["CoffeeScript",360],["VimL",325],["Perl",177],["R",161],["Scala",136],["Swift",132],["TeX",127],["OCaml",95],["Clojure",88],["Emacs Lisp",86],["Haskell",79],["Lua",65],["TypeScript",64],["Rust",61],["Matlab",47],["Arduino",47],["PowerShell",45],["Groovy",42],["XSLT",39],["Elixir",38],["Visual Basic",35],["Puppet",33],["Erlang",32],["Assembly",27],["Processing",20],["Dart",18],["ActionScript",18],["Scheme",18],["ASP",18],["Haxe",17],["F#",17],["Makefile",16],["Julia",14],["Prolog",14],["AppleScript",14],["Objective-C++",12],["Crystal",11],["AGS Script",11],["Common Lisp",10],["Racket",9],["Verilog",8],["Elm",8],["Tcl",7],["D",7],["FORTRAN",7],["Nix",6],["Kotlin",6],["Pascal",6],["M",6],["IDL",5],["Game Maker Language",5],["Vala",5],["LiveScript",5],["AutoHotkey",5],["Logos",5],["Nemerle",5],["Max",4],["Mathematica",4],["Awk",3],["LSL",3],["nesC",3],["SQL",3],["VHDL",3],["DM",3],["XQuery",3],["OpenSCAD",3],["REALbasic",3],["Apex",2],["Hack",2],["Pure Data",2],["Gosu",2],["Perl6",2],["NetLogo",2],["Ada",2],["Objective-J",2],["Standard ML",2],["UnrealScript",2],["Inform 7",2],["Bluespec",2],["Cuda",2],["Nimrod",2],["SourcePawn",2],["Ox",1],["Augeas",1],["ColdFusion",1],["Red",1],["Cycript",1],["MoonScript",1],["Alloy",1],["Forth",1],["OpenEdge ABL",1],["Idris",1],["Bison",1],["Propeller Spin",1],["SAS",1],["Smalltalk",1],["GDScript",1],["VCL",1],["Scilab",1],["ANTLR",1],["Lasso",1],["Mirah",1],["Factor",1]],"countryCode3":"CAN","countryCode2":"CA","countryName":"Canada","hourlyWage":21.88},"COD":{"2013":2,"2014":7,"fillKey":"JavaScript","allLangs":[["JavaScript",5],["CSS",3],["C++",2],["Go",1],["PHP",1],["CoffeeScript",1],["Shell",1],["C",1],["Haskell",1],["Python",1],["Perl",1],["VimL",1],["Java",1],["Ruby",1]],"countryCode3":"COD","countryCode2":"CD","countryName":"Democratic Republic Of Congo","hourlyWage":0},"CHE":{"2013":1417,"2014":2150,"fillKey":"JavaScript","allLangs":[["JavaScript",774],["Python",477],["Java",392],["CSS",367],["PHP",348],["C++",313],["Shell",231],["Ruby",230],["C",219],["C#",123],["Objective-C",118],["Scala",77],["Go",73],["CoffeeScript",68],["VimL",59],["TeX",58],["Perl",42],["R",36],["Swift",33],["Emacs Lisp",22],["Matlab",22],["Puppet",22],["Haskell",20],["Clojure",20],["Rust",19],["Lua",18],["OCaml",18],["TypeScript",17],["PowerShell",16],["XSLT",15],["Erlang",12],["Groovy",12],["Arduino",11],["FORTRAN",9],["Assembly",9],["Prolog",7],["F#",6],["Dart",5],["Elixir",4],["AGS Script",4],["Scheme",4],["Makefile",4],["ActionScript",3],["Julia",3],["Cuda",3],["AppleScript",3],["Vala",3],["Haxe",3],["Kotlin",3],["D",3],["Processing",3],["Visual Basic",2],["Pascal",2],["ASP",2],["M",2],["VHDL",2],["Smalltalk",2],["Common Lisp",2],["JSONiq",2],["Gnuplot",2],["Logos",2],["Mathematica",1],["Coq",1],["Objective-C++",1],["Tcl",1],["ColdFusion",1],["Nix",1],["OpenEdge ABL",1],["PureScript",1],["Awk",1],["LSL",1],["Crystal",1],["Objective-J",1],["REALbasic",1],["OpenSCAD",1],["BlitzBasic",1],["Mercury",1],["Verilog",1],["Elm",1],["Pure Data",1],["ANTLR",1],["Red",1],["AutoHotkey",1]],"countryCode3":"CHE","countryCode2":"CH","countryName":"Switzerland","hourlyWage":0},"CIV":{"2013":4,"2014":1,"fillKey":"Java","allLangs":[["Java",1],["Shell",1],["C",1]],"countryCode3":"CIV","countryCode2":"CI","countryName":"Cote d'Ivoire","hourlyWage":1.96},"CHL":{"2013":383,"2014":607,"fillKey":"JavaScript","allLangs":[["JavaScript",243],["CSS",129],["Ruby",111],["PHP",110],["Python",101],["Java",97],["Shell",48],["C",42],["Objective-C",33],["C++",33],["C#",30],["CoffeeScript",23],["Go",22],["VimL",14],["R",13],["Scala",10],["Swift",4],["TeX",4],["Puppet",4],["Haskell",4],["Matlab",3],["Perl",3],["Assembly",3],["OCaml",3],["TypeScript",3],["Processing",2],["Erlang",2],["Makefile",2],["Game Maker Language",2],["Scheme",2],["AGS Script",1],["PureScript",1],["Rust",1],["Visual Basic",1],["Lua",1],["Racket",1],["Vala",1],["Monkey",1],["Apex",1],["Elixir",1],["Groovy",1],["XSLT",1],["Crystal",1],["Stata",1],["nesC",1],["PowerShell",1],["ASP",1],["Clojure",1],["Emacs Lisp",1],["Xtend",1]],"countryCode3":"CHL","countryCode2":"CL","countryName":"Chile","hourlyWage":10.98},"CMR":{"2013":5,"2014":9,"fillKey":"JavaScript","allLangs":[["JavaScript",5],["PHP",3],["Java",2],["Python",2],["C#",2],["Shell",1],["CSS",1],["C",1],["Go",1],["Ruby",1]],"countryCode3":"CMR","countryCode2":"CM","countryName":"Cameroon","hourlyWage":0},"CHN":{"2013":9371,"2014":16965,"fillKey":"JavaScript","allLangs":[["JavaScript",7546],["Python",4783],["Java",4519],["CSS",3889],["C",3877],["C++",3451],["Objective-C",2375],["PHP",2155],["Ruby",2011],["Shell",1761],["Go",1478],["C#",1097],["VimL",908],["CoffeeScript",741],["Swift",668],["Scala",481],["Perl",314],["TeX",312],["Emacs Lisp",279],["Lua",275],["OCaml",181],["Clojure",161],["Matlab",157],["Erlang",155],["Groovy",133],["TypeScript",126],["Stata",124],["Rust",111],["Haskell",104],["ActionScript",103],["Objective-C++",103],["R",100],["XSLT",90],["PowerShell",54],["Assembly",48],["Scheme",48],["Elixir",47],["AGS Script",46],["Visual Basic",44],["Haxe",39],["Julia",33],["Common Lisp",31],["Makefile",30],["Racket",29],["Arduino",29],["Logos",23],["D",23],["Puppet",17],["Pascal",16],["Dart",15],["Tcl",15],["Prolog",15],["Game Maker Language",15],["AppleScript",14],["ASP",12],["AutoHotkey",12],["FORTRAN",11],["Verilog",10],["Red",10],["IDL",9],["Processing",9],["Crystal",8],["Vala",8],["Kotlin",7],["F#",7],["Arc",6],["Standard ML",5],["LiveScript",5],["Elm",5],["OpenEdge ABL",4],["Cuda",4],["M",3],["Frege",3],["VHDL",3],["VCL",3],["Mercury",3],["Mathematica",3],["Coq",2],["ANTLR",2],["Nimrod",2],["SQL",2],["FLUX",2],["Awk",2],["Gnuplot",2],["Hy",2],["wisp",2],["ColdFusion",2],["Slash",2],["Apex",2],["Nix",2],["Bison",2],["XML",2],["nesC",2],["GAP",2],["Parrot",2],["Zephir",2],["DOT",1],["MoonScript",1],["Nu",1],["Augeas",1],["Thrift",1],["BlitzBasic",1],["Cirru",1],["Pure Data",1],["RobotFramework",1],["Scilab",1],["Objective-J",1],["Nemerle",1],["SuperCollider",1],["OpenSCAD",1],["Xtend",1],["DCPU-16 ASM",1],["Self",1],["EmberScript",1],["Ceylon",1],["SourcePawn",1],["Factor",1],["AutoIt",1]],"countryCode3":"CHN","countryCode2":"CN","countryName":"China","hourlyWage":0},"COL":{"2013":342,"2014":566,"fillKey":"JavaScript","allLangs":[["JavaScript",229],["CSS",149],["PHP",104],["Java",100],["Ruby",83],["Python",79],["C++",35],["Objective-C",34],["Shell",32],["C",30],["C#",29],["CoffeeScript",19],["Go",13],["R",9],["Scala",8],["TeX",8],["Swift",7],["VimL",7],["Elixir",5],["Emacs Lisp",5],["Groovy",4],["Clojure",4],["Erlang",4],["OCaml",4],["PowerShell",3],["ANTLR",3],["FORTRAN",2],["Perl",2],["TypeScript",2],["Arduino",2],["Haskell",2],["ASP",1],["Assembly",1],["Puppet",1],["Lua",1],["Apex",1],["Stata",1],["D",1],["XSLT",1],["Mercury",1],["AGS Script",1],["Common Lisp",1],["Mathematica",1],["Objective-C++",1],["Prolog",1],["Rust",1],["Eiffel",1],["GDScript",1],["NetLogo",1],["Slash",1],["Matlab",1]],"countryCode3":"COL","countryCode2":"CO","countryName":"Colombia","hourlyWage":3.48},"CRI":{"2013":139,"2014":248,"fillKey":"JavaScript","allLangs":[["JavaScript",94],["CSS",58],["Java",54],["Ruby",32],["Python",32],["PHP",29],["C#",22],["C++",20],["C",17],["Objective-C",12],["Shell",12],["CoffeeScript",9],["Go",8],["Swift",5],["Assembly",4],["Visual Basic",3],["VimL",3],["Perl",2],["R",2],["Erlang",2],["Scheme",2],["Emacs Lisp",2],["Arduino",1],["Prolog",1],["Haxe",1],["TypeScript",1],["Clojure",1],["Game Maker Language",1],["ActionScript",1],["Processing",1],["Scala",1],["BlitzBasic",1]],"countryCode3":"CRI","countryCode2":"CR","countryName":"Costa Rica","hourlyWage":7.7},"CUB":{"2013":20,"2014":40,"fillKey":"JavaScript","allLangs":[["JavaScript",16],["PHP",10],["Python",7],["CSS",6],["Shell",5],["Ruby",4],["Java",3],["C++",3],["C#",2],["C",2],["Pascal",1],["TypeScript",1],["PowerShell",1],["Vala",1]],"countryCode3":"CUB","countryCode2":"CU","countryName":"Cuba","hourlyWage":0},"CPV":{"2013":1,"2014":1,"fillKey":"JavaScript","allLangs":[["JavaScript",1],["C++",1],["C",1],["Python",1],["Haskell",1],["C#",1]],"countryCode3":"CPV","countryCode2":"CV","countryName":"Cabo Verde"},"CUW":{"2013":2,"2014":4,"fillKey":"PHP","allLangs":[["PHP",3],["Python",1],["Shell",1]],"countryCode3":"CUW","countryCode2":"CW","countryName":"Curacao","hourlyWage":0},"CYP":{"2013":44,"2014":83,"fillKey":"JavaScript","allLangs":[["JavaScript",40],["CSS",18],["PHP",17],["Python",12],["Java",12],["Ruby",10],["C",9],["Shell",6],["Go",5],["C++",5],["VimL",5],["C#",4],["CoffeeScript",3],["Perl",2],["Swift",2],["Erlang",2],["Objective-C",2],["Elixir",2],["Arduino",1],["XSLT",1],["Emacs Lisp",1],["TypeScript",1],["Assembly",1],["Haskell",1],["Puppet",1],["TeX",1]],"countryCode3":"CYP","countryCode2":"CY","countryName":"Cyprus","hourlyWage":6.36},"CZE":{"2013":952,"2014":1424,"fillKey":"JavaScript","allLangs":[["JavaScript",475],["Java",293],["Python",274],["PHP",272],["CSS",196],["C++",183],["C",173],["Shell",162],["Ruby",161],["C#",87],["CoffeeScript",59],["Objective-C",52],["VimL",42],["TeX",38],["Perl",38],["Go",37],["Clojure",25],["Swift",24],["Scala",22],["TypeScript",15],["Puppet",12],["XSLT",12],["Groovy",12],["OCaml",11],["Haskell",11],["Rust",10],["Dart",10],["Lua",10],["R",10],["Arduino",10],["Makefile",9],["Emacs Lisp",9],["Matlab",7],["OpenSCAD",6],["Erlang",5],["Assembly",5],["PowerShell",5],["ActionScript",4],["D",4],["Objective-C++",4],["Julia",3],["Elixir",3],["Haxe",3],["F#",3],["Crystal",3],["Visual Basic",3],["SQF",2],["wisp",2],["Pure Data",2],["SourcePawn",2],["Racket",2],["LiveScript",2],["Pascal",2],["FORTRAN",2],["AGS Script",1],["BlitzBasic",1],["Nix",1],["Vala",1],["OpenEdge ABL",1],["XQuery",1],["Perl6",1],["Rebol",1],["ASP",1],["MoonScript",1],["Objective-J",1],["PAWN",1],["Game Maker Language",1],["Processing",1],["AppleScript",1],["Kotlin",1],["Mathematica",1],["SuperCollider",1],["Common Lisp",1],["DM",1],["M",1],["Nemerle",1],["XML",1],["Gnuplot",1],["Prolog",1],["IDL",1],["Scheme",1],["DOT",1],["Zephir",1]],"countryCode3":"CZE","countryCode2":"CZ","countryName":"Czech Republic","hourlyWage":3},"DEU":{"2013":8299,"2014":12612,"fillKey":"JavaScript","allLangs":[["JavaScript",4509],["Java",2602],["Python",2365],["PHP",2076],["CSS",1905],["Ruby",1643],["C++",1524],["C",1516],["Shell",1489],["Objective-C",776],["Go",644],["C#",635],["VimL",454],["CoffeeScript",452],["TeX",313],["Perl",287],["Scala",278],["Swift",192],["Lua",168],["R",140],["Haskell",140],["Emacs Lisp",139],["Clojure",131],["Groovy",126],["OCaml",123],["TypeScript",115],["Rust",110],["Puppet",84],["Erlang",76],["Arduino",59],["XSLT",55],["Visual Basic",52],["Assembly",44],["Elixir",42],["D",41],["Matlab",40],["Makefile",36],["Processing",32],["PowerShell",32],["F#",30],["Common Lisp",30],["Scheme",28],["Prolog",25],["Pascal",25],["AppleScript",24],["Dart",24],["Vala",22],["Objective-C++",21],["Nix",20],["Julia",19],["HaXe",18],["FORTRAN",18],["Xtend",16],["SQF",16],["Kotlin",16],["ActionScript",15],["Crystal",15],["AGS Script",14],["AutoHotkey",11],["Tcl",11],["XQuery",10],["VHDL",8],["BlitzBasic",8],["Elm",8],["ASP",6],["Game Maker Language",6],["Racket",6],["OpenEdge ABL",6],["OpenSCAD",5],["SourcePawn",5],["PureScript",5],["Max",5],["LiveScript",5],["Mathematica",5],["Objective-J",5],["Logos",5],["Perl6",4],["Verilog",4],["Gosu",4],["Standard ML",4],["Parrot",4],["Nimrod",4],["Smalltalk",4],["SuperCollider",4],["Idris",4],["Frege",4],["J",3],["IDL",3],["M",3],["Mercury",3],["Scilab",3],["SQL",2],["XML",2],["GAP",2],["Thrift",2],["Coq",2],["MoonScript",2],["Isabelle",2],["Apex",2],["Grammatical Framework",2],["Pure Data",2],["nesC",2],["AutoIt",1],["Component Pascal",1],["LabVIEW",1],["Propeller Spin",1],["DOT",1],["Ada",1],["Monkey",1],["Io",1],["PAWN",1],["UnrealScript",1],["Delphi",1],["ABAP",1],["ANTLR",1],["NetLogo",1],["Awk",1],["Ceylon",1],["Agda",1],["Arc",1],["Gnuplot",1],["Nu",1],["Cuda",1],["XC",1],["DM",1],["AspectJ",1],["GAMS",1],["DCPU-16 ASM",1],["Red",1]],"countryCode3":"DEU","countryCode2":"DE","countryName":"Germany","hourlyWage":16.5},"DNK":{"2013":1220,"2014":1699,"fillKey":"JavaScript","allLangs":[["JavaScript",615],["Python",273],["CSS",265],["Java",231],["PHP",231],["C#",221],["Ruby",178],["C",158],["C++",137],["Shell",119],["Objective-C",101],["Go",60],["VimL",58],["TeX",54],["CoffeeScript",51],["R",30],["Swift",27],["Perl",23],["Haskell",23],["Clojure",21],["Emacs Lisp",20],["OCaml",19],["Lua",19],["TypeScript",17],["Scala",15],["Matlab",13],["Dart",10],["Rust",10],["XSLT",10],["F#",10],["Standard ML",9],["Erlang",9],["Groovy",9],["Arduino",7],["Makefile",7],["Julia",6],["Assembly",5],["Elixir",5],["Processing",5],["Puppet",5],["AppleScript",4],["VHDL",4],["PowerShell",3],["Objective-C++",3],["OpenSCAD",3],["Visual Basic",3],["Mathematica",3],["VCL",3],["Coq",2],["GAMS",2],["Stata",2],["ASP",2],["XC",1],["Common Lisp",1],["OpenEdge ABL",1],["FORTRAN",1],["Haxe",1],["AGS Script",1],["M",1],["Mercury",1],["Cuda",1],["Pure Data",1],["Ragel in Ruby Host",1],["Tcl",1],["Verilog",1],["Nix",1],["Crystal",1],["Vala",1],["Mirah",1],["D",1],["PureScript",1],["SourcePawn",1],["ABAP",1],["Max",1],["Chapel",1],["Pascal",1],["Racket",1],["Scheme",1],["Arc",1],["Nemerle",1]],"countryCode3":"DNK","countryCode2":"DK","countryName":"Denmark","hourlyWage":17.58},"DMA":{"2013":5,"2014":1,"fillKey":"Python","allLangs":[["Python",1],["Java",1]],"countryCode3":"DMA","countryCode2":"DM","countryName":"Dominica","hourlyWage":0},"DOM":{"2013":70,"2014":126,"fillKey":"JavaScript","allLangs":[["JavaScript",60],["CSS",28],["Java",22],["Python",21],["PHP",18],["C#",16],["Ruby",15],["C++",10],["C",7],["Objective-C",6],["CoffeeScript",5],["Go",4],["Shell",4],["VimL",3],["Haskell",3],["PowerShell",3],["OCaml",3],["Swift",2],["Clojure",2],["Elixir",2],["Standard ML",1],["Assembly",1],["Erlang",1],["Scala",1],["Elm",1],["LiveScript",1],["Arc",1],["Emacs Lisp",1],["TeX",1],["Groovy",1],["Matlab",1],["Prolog",1]],"countryCode3":"DOM","countryCode2":"DO","countryName":"Dominican Republic","hourlyWage":1.82},"DZA":{"2013":36,"2014":62,"fillKey":"JavaScript","allLangs":[["JavaScript",25],["Java",19],["PHP",19],["Python",15],["CSS",13],["C++",9],["C#",7],["C",6],["Shell",3],["Go",3],["Ruby",3],["CoffeeScript",2],["Objective-C",2],["TeX",2],["TypeScript",2],["Emacs Lisp",1],["Matlab",1],["Swift",1],["Perl",1],["BlitzBasic",1],["SQL",1],["Haskell",1],["Objective-C++",1],["Scala",1]],"countryCode3":"DZA","countryCode2":"DZ","countryName":"Algeria","hourlyWage":7.04},"ECU":{"2013":71,"2014":147,"fillKey":"JavaScript","allLangs":[["JavaScript",43],["Java",36],["CSS",34],["PHP",27],["Python",24],["Ruby",11],["C++",7],["Objective-C",6],["C",5],["C#",5],["Go",5],["Shell",5],["Clojure",4],["Haskell",3],["R",3],["VimL",2],["Emacs Lisp",2],["Scala",2],["CoffeeScript",2],["Puppet",2],["DM",1],["Pascal",1],["Crystal",1],["TeX",1],["Agda",1],["Visual Basic",1],["IGOR Pro",1],["Objective-C++",1],["Vala",1],["Arduino",1],["Makefile",1]],"countryCode3":"ECU","countryCode2":"EC","countryName":"Ecuador","hourlyWage":0},"EST":{"2013":236,"2014":331,"fillKey":"JavaScript","allLangs":[["JavaScript",137],["Java",71],["Python",69],["CSS",55],["PHP",51],["Ruby",45],["C++",43],["Shell",35],["C",32],["C#",17],["Go",17],["CoffeeScript",15],["Objective-C",13],["Clojure",6],["OCaml",6],["Scala",5],["VimL",5],["Groovy",4],["Assembly",3],["Lua",3],["R",3],["Emacs Lisp",3],["Arduino",3],["Swift",3],["Vala",2],["F#",2],["TeX",2],["Prolog",2],["Makefile",2],["PowerShell",2],["Perl",2],["ActionScript",2],["Common Lisp",1],["IDL",1],["Processing",1],["Rust",1],["Dart",1],["Visual Basic",1],["Haskell",1],["Agda",1],["SQF",1],["VHDL",1],["TypeScript",1],["XSLT",1],["Haxe",1],["Ceylon",1],["D",1]],"countryCode3":"EST","countryCode2":"EE","countryName":"Estonia","hourlyWage":0},"EGY":{"2013":189,"2014":334,"fillKey":"JavaScript","allLangs":[["JavaScript",151],["Java",65],["PHP",63],["CSS",62],["Python",52],["Ruby",50],["C++",41],["C",32],["C#",30],["Objective-C",23],["Shell",19],["CoffeeScript",19],["Go",11],["Scala",10],["Swift",7],["R",7],["VimL",7],["OCaml",4],["PowerShell",2],["Matlab",2],["Perl",2],["TeX",2],["Elixir",2],["Assembly",2],["Objective-C++",1],["Arduino",1],["XSLT",1],["Delphi",1],["Groovy",1],["Scheme",1],["Crystal",1],["Erlang",1],["Julia",1],["Puppet",1],["Rust",1],["ASP",1],["Clojure",1],["Racket",1],["Visual Basic",1],["Lua",1],["Pascal",1],["Verilog",1],["Elm",1]],"countryCode3":"EGY","countryCode2":"EG","countryName":"Egypt","hourlyWage":1.94},"ERI":{"2013":103,"2014":200,"fillKey":"JavaScript","allLangs":[["JavaScript",78],["Python",51],["Java",38],["C",34],["CSS",32],["Shell",32],["Ruby",28],["PHP",24],["C++",21],["Go",17],["C#",14],["Objective-C",12],["VimL",8],["CoffeeScript",8],["Clojure",5],["Puppet",5],["TeX",4],["Swift",4],["XSLT",4],["Perl",4],["R",3],["ActionScript",3],["Emacs Lisp",3],["Haskell",2],["Lua",2],["ASP",2],["TypeScript",2],["Groovy",2],["Scala",2],["Game Maker Language",2],["Erlang",1],["Eiffel",1],["OpenSCAD",1],["Apex",1],["Rust",1],["Dart",1],["F#",1],["Haxe",1],["MoonScript",1],["PowerShell",1],["BlitzBasic",1],["Racket",1],["Arduino",1],["DM",1],["Vala",1],["Idris",1],["Agda",1],["Prolog",1]],"countryCode3":"ERI","countryCode2":"ER","countryName":"Eritrea","hourlyWage":2.4},"ESP":{"2013":2722,"2014":4005,"fillKey":"JavaScript","allLangs":[["JavaScript",1565],["Python",848],["Java",771],["CSS",714],["PHP",631],["Ruby",539],["Shell",417],["C",395],["C++",386],["Objective-C",244],["C#",191],["Go",157],["CoffeeScript",114],["VimL",112],["TeX",85],["Swift",79],["R",76],["Scala",65],["Perl",65],["Groovy",42],["Clojure",40],["Emacs Lisp",37],["Puppet",36],["Lua",34],["Arduino",31],["Haskell",26],["Matlab",21],["TypeScript",20],["Rust",20],["OCaml",19],["PowerShell",17],["Assembly",15],["Makefile",14],["Erlang",14],["Haxe",12],["Visual Basic",11],["XSLT",10],["OpenSCAD",9],["D",9],["ActionScript",9],["Processing",8],["Vala",8],["Elixir",8],["Dart",8],["F#",6],["Prolog",6],["FORTRAN",6],["AGS Script",5],["Pure Data",5],["Gosu",5],["AppleScript",4],["Max",4],["Common Lisp",4],["ASP",4],["VCL",4],["Scheme",3],["Objective-C++",3],["Nix",3],["Ada",3],["Elm",2],["Game Maker Language",2],["SQL",2],["Julia",2],["Tcl",2],["Pascal",2],["ANTLR",2],["Ceylon",2],["Mathematica",2],["Racket",2],["nesC",2],["wisp",1],["ABAP",1],["Bison",1],["J",1],["CLIPS",1],["LabVIEW",1],["Crystal",1],["DM",1],["Smalltalk",1],["ColdFusion",1],["Nimrod",1],["Verilog",1],["xBase",1],["GAP",1],["Harbour",1],["SuperCollider",1],["PureScript",1],["AutoHotkey",1],["IDL",1],["Kotlin",1],["SQF",1],["VHDL",1],["Gnuplot",1],["M",1],["Cuda",1]],"countryCode3":"ESP","countryCode2":"ES","countryName":"Spain","hourlyWage":0},"ETH":{"2013":4,"2014":11,"fillKey":"Java","allLangs":[["Java",3],["PHP",3],["JavaScript",3],["C",2],["Ruby",2],["CSS",2],["C++",1],["OCaml",1],["CoffeeScript",1],["C#",1],["Shell",1],["Python",1]],"countryCode3":"ETH","countryCode2":"ET","countryName":"Ethiopia","hourlyWage":0},"FIN":{"2013":941,"2014":1443,"fillKey":"JavaScript","allLangs":[["JavaScript",572],["Python",299],["Java",254],["CSS",218],["C++",210],["C",181],["Ruby",158],["PHP",143],["Shell",128],["C#",60],["CoffeeScript",57],["Objective-C",51],["VimL",47],["Go",45],["Clojure",42],["TeX",37],["Perl",34],["Scala",30],["R",29],["Emacs Lisp",25],["Lua",19],["OCaml",18],["Rust",17],["Haskell",13],["TypeScript",10],["Groovy",8],["Matlab",8],["Swift",8],["XSLT",7],["Common Lisp",6],["Puppet",6],["Erlang",6],["Makefile",6],["Arduino",6],["Racket",4],["Elixir",4],["D",4],["ActionScript",3],["F#",3],["Processing",3],["Visual Basic",3],["Haxe",2],["LiveScript",2],["Perl6",2],["Pascal",2],["Elm",1],["Frege",1],["Pure Data",1],["Red",1],["BlitzBasic",1],["MoonScript",1],["Objective-C++",1],["Dart",1],["Julia",1],["ASP",1],["Nu",1],["Verilog",1],["OpenSCAD",1],["PigLatin",1],["Gnuplot",1],["SourcePawn",1],["AGS Script",1],["Nemerle",1],["Vala",1],["Objective-J",1],["FORTRAN",1],["REALbasic",1],["Kotlin",1],["Scheme",1],["Assembly",1],["Mirah",1],["VHDL",1],["PowerShell",1],["SQF",1],["Nix",1],["VCL",1],["Crystal",1]],"countryCode3":"FIN","countryCode2":"FI","countryName":"Finland","hourlyWage":14.52},"FJI":{"2013":1,"2014":1,"fillKey":"Python","allLangs":[["Python",1]],"countryCode3":"FJI","countryCode2":"FJ","countryName":"Fiji","hourlyWage":12.14},"FRO":{"2013":2,"2014":2,"fillKey":"JavaScript","allLangs":[["JavaScript",2],["Java",1],["C#",1],["Shell",1],["Haskell",1],["C",1],["Scala",1]],"countryCode3":"FRO","countryCode2":"FO","countryName":"Faroe Islands","hourlyWage":0},"FRA":{"2013":5874,"2014":9158,"fillKey":"JavaScript","allLangs":[["JavaScript",3635],["Python",1870],["PHP",1859],["Java",1709],["CSS",1708],["C",1098],["Ruby",1036],["Shell",1018],["C++",996],["Objective-C",424],["Go",407],["C#",399],["CoffeeScript",359],["VimL",253],["Scala",211],["TeX",155],["Perl",153],["OCaml",146],["Swift",114],["Emacs Lisp",110],["Lua",89],["R",88],["Rust",69],["TypeScript",68],["Haskell",67],["Groovy",63],["Clojure",48],["Assembly",45],["Arduino",44],["Puppet",43],["XSLT",42],["Matlab",37],["Erlang",35],["Haxe",32],["ActionScript",27],["Makefile",27],["Dart",24],["Julia",22],["Elixir",21],["PowerShell",21],["Processing",21],["Prolog",18],["D",17],["Visual Basic",17],["FORTRAN",16],["AGS Script",16],["F#",14],["Scheme",13],["Common Lisp",13],["Smalltalk",9],["VHDL",9],["Kotlin",8],["Vala",7],["BlitzBasic",7],["Ada",7],["Elm",7],["Pascal",7],["Racket",6],["Objective-C++",6],["Awk",6],["SQF",5],["Crystal",5],["Tcl",5],["Max",4],["Game Maker Language",4],["VCL",4],["Cuda",4],["DOT",4],["Frege",4],["Scilab",3],["Nix",3],["ASP",3],["Ceylon",3],["Coq",3],["M",3],["Logos",3],["AutoHotkey",3],["IDL",3],["Red",3],["Standard ML",2],["Gosu",2],["Lasso",2],["Delphi",2],["Arc",2],["Augeas",2],["XQuery",2],["OpenSCAD",2],["Nimrod",2],["SQL",2],["Objective-J",2],["PureScript",2],["Cycript",1],["Factor",1],["xBase",1],["AutoIt",1],["PogoScript",1],["Inform 7",1],["COBOL",1],["Mathematica",1],["NetLogo",1],["Mercury",1],["Nu",1],["AspectJ",1],["XML",1],["Pure Data",1],["Rebol",1],["ABAP",1],["Boo",1],["Propeller Spin",1],["nesC",1],["XProc",1],["Bison",1]],"countryCode3":"FRA","countryCode2":"FR","countryName":"France","hourlyWage":0},"GBR":{"2013":8877,"2014":13400,"fillKey":"JavaScript","allLangs":[["JavaScript",5313],["CSS",2705],["Python",2581],["Ruby",1978],["PHP",1970],["Java",1842],["Shell",1301],["C",1223],["C++",1143],["C#",935],["Objective-C",718],["Go",611],["CoffeeScript",493],["VimL",425],["Perl",297],["Scala",293],["TeX",207],["Swift",207],["Clojure",197],["R",195],["Haskell",149],["Emacs Lisp",143],["OCaml",142],["Puppet",135],["Lua",119],["Groovy",84],["PowerShell",84],["Matlab",81],["TypeScript",76],["Rust",75],["Erlang",70],["Arduino",67],["Assembly",56],["F#",49],["XSLT",40],["Elixir",36],["ActionScript",35],["Makefile",34],["Scheme",33],["Visual Basic",33],["Haxe",30],["D",29],["Julia",25],["Processing",21],["Common Lisp",20],["Objective-C++",19],["Prolog",18],["FORTRAN",16],["AGS Script",15],["Crystal",14],["ASP",14],["AppleScript",13],["PureScript",13],["OpenSCAD",13],["Racket",12],["ColdFusion",11],["Dart",11],["Nix",11],["Vala",11],["DM",10],["Kotlin",10],["Pascal",9],["Tcl",8],["IDL",7],["Logos",7],["Verilog",7],["LiveScript",7],["Mathematica",6],["M",6],["SQF",6],["Io",6],["Agda",6],["Apex",5],["Coq",5],["AutoHotkey",5],["Standard ML",5],["XC",5],["SQL",5],["VHDL",4],["Elm",4],["Awk",4],["Nimrod",4],["Idris",4],["Ada",4],["Cuda",4],["DOT",4],["Nemerle",4],["SourcePawn",3],["Game Maker Language",3],["Stata",3],["VCL",3],["GAP",3],["OpenEdge ABL",3],["Gosu",3],["Component Pascal",3],["Augeas",2],["Max",2],["Perl6",2],["Eiffel",2],["SuperCollider",2],["Hack",2],["PAWN",2],["LookML",2],["Smalltalk",2],["Scilab",2],["Brightscript",2],["Gnuplot",2],["BlitzBasic",1],["NetLogo",1],["PogoScript",1],["XML",1],["Pure Data",1],["Red",1],["Forth",1],["MoonScript",1],["Squirrel",1],["SystemVerilog",1],["Pan",1],["J",1],["wisp",1],["Lasso",1],["Mercury",1],["BlitzMax",1],["Ceylon",1],["XProc",1],["ATS",1],["Bison",1],["Hy",1],["Parrot",1],["ANTLR",1],["AutoIt",1],["FLUX",1],["Monkey",1],["Clean",1],["Cycript",1],["Arc",1],["Ecl",1]],"countryCode3":"GBR","countryCode2":"GB","countryName":"United Kingdom","hourlyWage":48.66},"GRD":{"2013":2,"2014":9,"fillKey":"JavaScript","allLangs":[["JavaScript",4],["CSS",3],["Java",2],["C#",2],["Makefile",1],["Scala",1],["PHP",1],["TeX",1],["Python",1]],"countryCode3":"GRD","countryCode2":"GD","countryName":"Grenada","hourlyWage":5.34},"GEO":{"2013":41,"2014":64,"fillKey":"JavaScript","allLangs":[["JavaScript",31],["Python",14],["PHP",14],["CSS",12],["Java",11],["C",8],["C#",7],["Objective-C",7],["Ruby",6],["C++",5],["CoffeeScript",3],["ActionScript",2],["Shell",2],["PowerShell",1],["TypeScript",1],["Groovy",1],["OCaml",1],["Game Maker Language",1],["Lua",1],["Visual Basic",1],["Go",1],["R",1]],"countryCode3":"GEO","countryCode2":"GE","countryName":"Georgia","hourlyWage":0},"GGY":{"2013":3,"2014":4,"fillKey":"JavaScript","allLangs":[["JavaScript",2],["PHP",1],["Objective-C",1],["CSS",1]],"countryCode3":"GGY","countryCode2":"GG","countryName":"Guernsey","hourlyWage":0},"GHA":{"2013":51,"2014":76,"fillKey":"JavaScript","allLangs":[["JavaScript",36],["CSS",28],["Java",24],["Ruby",22],["PHP",16],["Python",13],["C#",6],["Shell",5],["C++",5],["C",5],["Go",4],["R",3],["Swift",3],["Objective-C",2],["VimL",2],["CoffeeScript",2],["TypeScript",1],["Lua",1]],"countryCode3":"GHA","countryCode2":"GH","countryName":"Ghana","hourlyWage":4.9},"GIB":{"2013":8,"2014":12,"fillKey":"JavaScript","allLangs":[["JavaScript",8],["Java",3],["Shell",2],["Ruby",2],["Go",1],["Python",1],["CSS",1]],"countryCode3":"GIB","countryCode2":"GI","countryName":"Gibraltar","hourlyWage":0},"GRL":{"2013":2,"2014":3,"fillKey":"CSS","allLangs":[["CSS",3],["Rust",2],["JavaScript",2],["Shell",2],["Ruby",2],["VimL",1],["Python",1],["C++",1],["Matlab",1]],"countryCode3":"GRL","countryCode2":"GL","countryName":"Greenland","hourlyWage":0},"GMB":{"2013":1,"2014":1,"fillKey":"JavaScript","allLangs":[["JavaScript",1],["Ruby",1]],"countryCode3":"GMB","countryCode2":"GM","countryName":"Gambia"},"GLP":{"2013":4,"2014":5,"fillKey":"JavaScript","allLangs":[["JavaScript",3],["PHP",2],["CoffeeScript",1],["Python",1],["C",1],["CSS",1],["Ruby",1],["C++",1],["Java",1],["Shell",1]],"countryCode3":"GLP","countryCode2":"GP","countryName":"Guadeloupe","hourlyWage":14.78},"GRC":{"2013":512,"2014":750,"fillKey":"JavaScript","allLangs":[["JavaScript",273],["Python",158],["Java",143],["CSS",138],["PHP",117],["C",110],["C++",101],["Ruby",88],["Shell",83],["C#",46],["Objective-C",40],["Go",31],["CoffeeScript",28],["VimL",24],["Scala",18],["Perl",17],["R",16],["Emacs Lisp",10],["OCaml",9],["F#",9],["TeX",9],["Swift",9],["Arduino",8],["XSLT",7],["Clojure",7],["Haskell",6],["Erlang",6],["TypeScript",5],["Julia",5],["Lua",4],["Assembly",4],["Elixir",3],["Matlab",3],["Rust",3],["Groovy",3],["Dart",3],["ActionScript",2],["D",2],["Standard ML",2],["Makefile",2],["Kotlin",2],["Visual Basic",2],["Puppet",2],["Mathematica",2],["PowerShell",2],["Scheme",1],["Tcl",1],["Processing",1],["Vala",1],["Objective-C++",1],["Crystal",1],["Nimrod",1],["PAWN",1],["Factor",1],["VHDL",1],["Objective-J",1],["Smalltalk",1]],"countryCode3":"GRC","countryCode2":"GR","countryName":"Greece","hourlyWage":0},"GTM":{"2013":61,"2014":108,"fillKey":"JavaScript","allLangs":[["JavaScript",48],["PHP",24],["CSS",22],["Java",20],["Python",18],["Ruby",12],["C#",9],["CoffeeScript",6],["C++",4],["Objective-C",4],["C",3],["R",3],["Shell",2],["Go",2],["F#",1],["TeX",1],["Haskell",1],["Arduino",1],["Clojure",1],["Emacs Lisp",1],["Puppet",1],["Swift",1],["Assembly",1],["Groovy",1],["Perl",1]],"countryCode3":"GTM","countryCode2":"GT","countryName":"Guatemala","hourlyWage":5.02},"GUY":{"2013":1,"2014":1,"fillKey":"Python","allLangs":[["Python",1],["JavaScript",1]],"countryCode3":"GUY","countryCode2":"GY","countryName":"Guyana"},"HKG":{"2013":331,"2014":556,"fillKey":"JavaScript","allLangs":[["JavaScript",236],["Python",145],["Java",128],["CSS",119],["C++",98],["Ruby",87],["PHP",77],["C",76],["Objective-C",71],["Shell",44],["C#",39],["Go",36],["CoffeeScript",31],["Swift",19],["TeX",13],["R",12],["Scala",12],["VimL",12],["OCaml",12],["Matlab",11],["Perl",10],["Emacs Lisp",8],["Haskell",7],["Erlang",5],["Rust",4],["Arduino",4],["HaXe",3],["Lua",3],["Cuda",3],["Crystal",2],["ActionScript",2],["Elixir",2],["TypeScript",2],["Assembly",2],["Clojure",2],["Prolog",2],["Groovy",2],["XSLT",2],["Arc",1],["Elm",1],["GAP",1],["Verilog",1],["IDL",1],["Apex",1],["AutoHotkey",1],["Pascal",1],["PureScript",1],["Dart",1],["F#",1],["Julia",1],["Objective-C++",1],["PowerShell",1],["Rebol",1],["AppleScript",1],["Nix",1],["Coq",1],["SAS",1],["Game Maker Language",1],["AGS Script",1]],"countryCode3":"HKG","countryCode2":"HK","countryName":"Hong Kong","hourlyWage":10.72},"HND":{"2013":41,"2014":46,"fillKey":"JavaScript","allLangs":[["JavaScript",14],["CSS",11],["Java",10],["C#",8],["Python",8],["PHP",6],["C++",4],["Shell",4],["C",4],["Ruby",2],["Visual Basic",2],["CoffeeScript",1],["Swift",1],["AppleScript",1],["PowerShell",1],["Erlang",1]],"countryCode3":"HND","countryCode2":"HN","countryName":"Honduras","hourlyWage":5.04},"HRV":{"2013":254,"2014":370,"fillKey":"JavaScript","allLangs":[["JavaScript",118],["PHP",78],["Python",65],["CSS",61],["Java",58],["C++",47],["Shell",40],["C",39],["Ruby",37],["C#",35],["Go",19],["VimL",17],["Objective-C",15],["CoffeeScript",12],["Scala",9],["Perl",8],["Lua",6],["Groovy",5],["Haskell",5],["TypeScript",5],["Swift",3],["Matlab",3],["Elixir",3],["PowerShell",3],["Rust",3],["Nimrod",2],["Clojure",2],["SQF",2],["Scheme",2],["TeX",2],["Emacs Lisp",2],["Makefile",1],["OCaml",1],["Processing",1],["XSLT",1],["Julia",1],["Arduino",1],["FORTRAN",1],["PAWN",1],["Zephir",1],["Assembly",1],["SQL",1],["Visual Basic",1],["nesC",1],["ActionScript",1],["R",1],["Haxe",1]],"countryCode3":"HRV","countryCode2":"HR","countryName":"Croatia","hourlyWage":7.68},"HTI":{"2013":1,"2014":1,"fillKey":"PHP","allLangs":[["PHP",1],["Perl",1]],"countryCode3":"HTI","countryCode2":"HT","countryName":"Haiti","hourlyWage":0},"HUN":{"2013":513,"2014":786,"fillKey":"JavaScript","allLangs":[["JavaScript",303],["Java",158],["Python",136],["PHP",125],["CSS",122],["Shell",101],["C++",99],["C",93],["Ruby",85],["C#",49],["Go",36],["Objective-C",29],["VimL",28],["CoffeeScript",27],["Perl",17],["Scala",14],["Lua",13],["OCaml",11],["Swift",10],["TeX",9],["Groovy",9],["R",8],["Assembly",7],["Rust",7],["Emacs Lisp",7],["Clojure",6],["Haskell",5],["Erlang",5],["F#",5],["Makefile",4],["Elixir",3],["Dart",3],["Puppet",3],["Mercury",2],["Prolog",2],["Racket",2],["AGS Script",2],["Arduino",2],["Elm",2],["ANTLR",2],["Processing",2],["TypeScript",2],["Kotlin",2],["nesC",2],["D",2],["Visual Basic",2],["AppleScript",1],["Matlab",1],["Common Lisp",1],["FLUX",1],["Verilog",1],["AutoHotkey",1],["PowerShell",1],["XQuery",1],["Nemerle",1],["Perl6",1],["SQF",1],["FORTRAN",1],["Haxe",1],["Bluespec",1],["DM",1],["Scheme",1],["Agda",1],["PureScript",1],["GAP",1]],"countryCode3":"HUN","countryCode2":"HU","countryName":"Hungary","hourlyWage":6.46},"IDN":{"2013":820,"2014":1258,"fillKey":"JavaScript","allLangs":[["JavaScript",525],["PHP",438],["CSS",298],["Java",271],["Python",150],["Ruby",130],["C",102],["C++",97],["Shell",78],["Go",52],["CoffeeScript",45],["C#",43],["Objective-C",38],["VimL",22],["Scala",17],["Lua",12],["Perl",12],["OCaml",11],["Swift",10],["Haskell",8],["TeX",6],["R",6],["TypeScript",6],["ActionScript",6],["Clojure",6],["Groovy",6],["Erlang",5],["Makefile",5],["Vala",5],["AGS Script",4],["XSLT",4],["Rust",4],["Emacs Lisp",3],["Pascal",3],["Processing",3],["Elixir",3],["F#",2],["Matlab",2],["Arduino",2],["D",2],["Assembly",2],["Julia",2],["AppleScript",1],["PAWN",1],["Visual Basic",1],["Awk",1],["PowerShell",1],["Standard ML",1],["VHDL",1],["Nimrod",1],["Scheme",1],["Max",1],["Apex",1],["Common Lisp",1],["Haxe",1],["Racket",1],["MoonScript",1]],"countryCode3":"IDN","countryCode2":"ID","countryName":"Indonesia","hourlyWage":0},"IRL":{"2013":713,"2014":1141,"fillKey":"JavaScript","allLangs":[["JavaScript",428],["Java",226],["Python",225],["CSS",205],["Ruby",160],["C",117],["C++",112],["C#",98],["PHP",96],["Shell",95],["Objective-C",59],["Go",41],["Swift",31],["VimL",31],["CoffeeScript",29],["Scala",27],["R",25],["Perl",24],["Haskell",18],["TeX",16],["Emacs Lisp",14],["Clojure",13],["Groovy",10],["OCaml",10],["Lua",9],["F#",8],["Erlang",7],["TypeScript",7],["Arduino",6],["Processing",4],["Rust",4],["D",4],["Julia",3],["Matlab",3],["Visual Basic",3],["Pascal",3],["Puppet",3],["PowerShell",3],["Makefile",3],["Haxe",3],["ActionScript",3],["Vala",2],["DM",2],["VCL",2],["XSLT",2],["Scheme",2],["OpenSCAD",1],["Crystal",1],["Standard ML",1],["Game Maker Language",1],["Ada",1],["BlitzBasic",1],["Objective-C++",1],["CLIPS",1],["Kotlin",1],["ASP",1],["nesC",1],["OpenEdge ABL",1],["ColdFusion",1],["Elixir",1],["SQF",1],["AppleScript",1],["BlitzMax",1],["Objective-J",1],["Tcl",1],["LabVIEW",1],["Assembly",1]],"countryCode3":"IRL","countryCode2":"IE","countryName":"Ireland","hourlyWage":0},"ISR":{"2013":525,"2014":837,"fillKey":"JavaScript","allLangs":[["JavaScript",377],["Java",172],["Python",165],["CSS",130],["Ruby",113],["PHP",92],["C",78],["Shell",67],["C++",65],["C#",53],["Objective-C",51],["Go",43],["CoffeeScript",39],["VimL",19],["Scala",18],["Swift",15],["R",13],["Emacs Lisp",10],["Haskell",10],["Clojure",10],["Perl",9],["OCaml",8],["TeX",8],["Puppet",6],["PowerShell",5],["Lua",5],["Assembly",5],["Groovy",5],["D",4],["TypeScript",4],["Rust",4],["Matlab",4],["ActionScript",3],["IDL",2],["Nemerle",2],["ASP",2],["Visual Basic",2],["AGS Script",2],["Scheme",2],["Erlang",2],["Verilog",2],["LiveScript",2],["Elixir",2],["Arduino",2],["Red",1],["F#",1],["Logos",1],["Objective-C++",1],["Julia",1],["PureScript",1],["Dart",1],["Prolog",1],["Racket",1],["Cuda",1],["Haxe",1],["XSLT",1],["Pascal",1]],"countryCode3":"ISR","countryCode2":"IL","countryName":"Israel","hourlyWage":0},"IMN":{"2013":5,"2014":6,"fillKey":"JavaScript","allLangs":[["JavaScript",2],["Shell",2],["C",2],["PHP",2],["Perl",1],["CSS",1],["Python",1],["Perl6",1]],"countryCode3":"IMN","countryCode2":"IM","countryName":"Isle Of Man","hourlyWage":9.6},"IND":{"2013":4494,"2014":8134,"fillKey":"JavaScript","allLangs":[["JavaScript",3098],["Java",1930],["Python",1631],["CSS",1590],["PHP",997],["Ruby",930],["C++",798],["C",772],["Shell",496],["Objective-C",375],["C#",321],["Go",255],["CoffeeScript",229],["R",150],["Scala",146],["VimL",145],["Perl",88],["Swift",86],["TeX",85],["Emacs Lisp",75],["OCaml",58],["Clojure",56],["Matlab",52],["Haskell",51],["Groovy",48],["Rust",34],["Lua",34],["TypeScript",32],["Assembly",26],["Arduino",25],["Erlang",24],["PowerShell",24],["Puppet",18],["Makefile",17],["Visual Basic",17],["ActionScript",17],["XSLT",16],["D",14],["Elixir",13],["Prolog",13],["Vala",13],["Julia",12],["Processing",12],["Common Lisp",11],["Objective-C++",6],["Verilog",6],["Dart",6],["AGS Script",6],["COBOL",5],["M",5],["Elm",5],["ASP",5],["nesC",4],["Apex",4],["Racket",4],["Standard ML",4],["Nemerle",4],["Game Maker Language",4],["Haxe",3],["Tcl",3],["Scheme",3],["AppleScript",3],["AutoHotkey",3],["Kotlin",3],["Cuda",3],["VCL",3],["Crystal",2],["PigLatin",2],["J",2],["Nix",2],["OpenSCAD",2],["Objective-J",2],["VHDL",2],["F#",2],["Gosu",2],["IDL",2],["Scilab",2],["AspectJ",1],["BlitzBasic",1],["SQL",1],["FORTRAN",1],["PureScript",1],["AutoIt",1],["LiveScript",1],["MoonScript",1],["Perl6",1],["Hy",1],["Frege",1],["Bison",1],["SourcePawn",1],["Coq",1],["Rebol",1],["ColdFusion",1]],"countryCode3":"IND","countryCode2":"IN","countryName":"India","hourlyWage":2.38},"IRQ":{"2013":18,"2014":31,"fillKey":"JavaScript","allLangs":[["JavaScript",14],["Python",9],["PHP",9],["Java",8],["C",7],["CSS",7],["Ruby",6],["C++",5],["Go",3],["Shell",2],["Perl",2],["CoffeeScript",2],["C#",2],["Objective-C",1],["Swift",1],["Lua",1],["VimL",1]],"countryCode3":"IRQ","countryCode2":"IQ","countryName":"Iraq","hourlyWage":0},"IRN":{"2013":246,"2014":415,"fillKey":"JavaScript","allLangs":[["JavaScript",170],["CSS",109],["PHP",101],["Java",91],["Python",80],["C",52],["C++",49],["C#",41],["Shell",33],["Ruby",32],["Go",24],["Objective-C",18],["CoffeeScript",18],["TeX",7],["Emacs Lisp",7],["VimL",7],["Scala",5],["Matlab",3],["Erlang",3],["OCaml",3],["Assembly",2],["Groovy",2],["Lua",2],["ActionScript",2],["Game Maker Language",2],["TypeScript",2],["Haskell",2],["Elixir",2],["Vala",2],["nesC",1],["PowerShell",1],["R",1],["Perl",1],["Puppet",1],["Processing",1],["AutoHotkey",1],["Clojure",1],["Mathematica",1],["ANTLR",1],["Swift",1],["XSLT",1],["Julia",1],["Prolog",1],["AutoIt",1],["FORTRAN",1]],"countryCode3":"IRN","countryCode2":"IR","countryName":"Iran, Islamic Republic Of","hourlyWage":0},"ISL":{"2013":106,"2014":144,"fillKey":"JavaScript","allLangs":[["JavaScript",72],["Python",38],["Java",30],["C#",22],["CSS",18],["Ruby",15],["C",12],["PHP",9],["Shell",8],["C++",8],["Objective-C",6],["VimL",6],["Haskell",6],["Go",6],["CoffeeScript",5],["Swift",4],["Perl",3],["Erlang",2],["TeX",2],["Elixir",2],["Lua",2],["Rust",2],["Emacs Lisp",2],["R",2],["Groovy",1],["PureScript",1],["Common Lisp",1],["Clojure",1],["OCaml",1],["SQF",1],["Crystal",1],["Puppet",1],["Verilog",1]],"countryCode3":"ISL","countryCode2":"IS","countryName":"Iceland","hourlyWage":0},"ITA":{"2013":1965,"2014":2975,"fillKey":"JavaScript","allLangs":[["JavaScript",1108],["Java",616],["Python",591],["CSS",550],["PHP",522],["C++",442],["C",388],["Ruby",338],["Shell",295],["Objective-C",178],["C#",171],["CoffeeScript",106],["Go",97],["VimL",82],["Scala",51],["R",50],["Swift",49],["TeX",48],["Perl",46],["Emacs Lisp",29],["Matlab",26],["Lua",25],["Puppet",25],["Haskell",24],["Clojure",24],["Groovy",22],["Makefile",22],["TypeScript",21],["OCaml",20],["Rust",18],["Arduino",17],["Erlang",15],["Visual Basic",12],["PowerShell",10],["XSLT",10],["Assembly",10],["Objective-C++",9],["Processing",9],["Prolog",8],["Dart",8],["Vala",7],["Scheme",6],["F#",6],["AGS Script",5],["ActionScript",5],["FORTRAN",5],["Julia",4],["Elixir",4],["Common Lisp",4],["Pascal",4],["Haxe",4],["nesC",3],["ASP",3],["Kotlin",3],["AppleScript",3],["Xtend",2],["Apex",2],["SQL",2],["CLIPS",2],["Standard ML",2],["LabVIEW",2],["Game Maker Language",2],["Bison",1],["SuperCollider",1],["Crystal",1],["Eiffel",1],["AutoHotkey",1],["SAS",1],["LiveScript",1],["Mercury",1],["D",1],["PAWN",1],["Gnuplot",1],["IDL",1],["BlitzBasic",1],["Nimrod",1],["VHDL",1],["OpenSCAD",1],["Awk",1],["Logos",1],["MoonScript",1],["ANTLR",1],["Idris",1],["BlitzMax",1],["SourcePawn",1],["Tcl",1],["Cuda",1],["Nix",1],["Elm",1],["Ada",1],["Red",1]],"countryCode3":"ITA","countryCode2":"IT","countryName":"Italy","hourlyWage":9.52},"JEY":{"2013":16,"2014":21,"fillKey":"JavaScript","allLangs":[["JavaScript",7],["Shell",6],["Java",6],["Ruby",4],["PHP",3],["C#",2],["CSS",2],["SQL",1],["Emacs Lisp",1],["Objective-C",1],["CoffeeScript",1],["Groovy",1],["OCaml",1],["Logos",1],["Python",1],["C++",1],["Perl",1]],"countryCode3":"JEY","countryCode2":"JE","countryName":"Jersey","hourlyWage":0},"JAM":{"2013":22,"2014":41,"fillKey":"CSS","allLangs":[["CSS",18],["JavaScript",17],["PHP",11],["Java",7],["Python",7],["Ruby",7],["C++",5],["C",5],["C#",4],["Shell",3],["Go",2],["Objective-C",2],["CoffeeScript",1],["ooc",1],["Objective-C++",1],["Visual Basic",1],["Swift",1],["Clojure",1],["Groovy",1],["OCaml",1],["Emacs Lisp",1],["Prolog",1],["TypeScript",1]],"countryCode3":"JAM","countryCode2":"JM","countryName":"Jamaica","hourlyWage":0},"JOR":{"2013":41,"2014":79,"fillKey":"JavaScript","allLangs":[["JavaScript",39],["CSS",18],["Java",15],["Python",15],["PHP",14],["Ruby",13],["C",8],["Objective-C",8],["Shell",7],["C++",6],["C#",5],["CoffeeScript",5],["Go",3],["OCaml",3],["Perl",2],["VimL",2],["Swift",2],["R",2],["Makefile",1],["PowerShell",1],["Clojure",1],["Haskell",1],["Emacs Lisp",1],["Scala",1],["Assembly",1],["Haxe",1],["TeX",1]],"countryCode3":"JOR","countryCode2":"JO","countryName":"Jordan","hourlyWage":3.86},"JPN":{"2013":4266,"2014":5923,"fillKey":"JavaScript","allLangs":[["JavaScript",2120],["Ruby",1569],["CSS",1016],["Java",923],["Python",920],["Shell",856],["C",820],["C++",764],["Objective-C",579],["PHP",576],["VimL",527],["Go",492],["C#",420],["CoffeeScript",417],["Emacs Lisp",253],["Swift",227],["Scala",211],["Perl",177],["OCaml",130],["Haskell",112],["Groovy",80],["TeX",80],["Clojure",79],["TypeScript",56],["Rust",47],["Lua",44],["R",37],["Erlang",36],["PowerShell",34],["Elixir",33],["Scheme",33],["Common Lisp",30],["Assembly",23],["Makefile",22],["Julia",21],["Dart",20],["Arduino",20],["Puppet",15],["Processing",15],["XSLT",15],["F#",14],["Matlab",14],["AppleScript",13],["AGS Script",12],["Objective-C++",12],["Coq",11],["FORTRAN",11],["D",11],["ActionScript",9],["Visual Basic",9],["Haxe",8],["Kotlin",8],["Prolog",8],["Verilog",8],["Gosu",8],["Crystal",6],["Logos",5],["VHDL",5],["Pascal",4],["Cuda",4],["Agda",3],["ASP",3],["IDL",3],["PureScript",3],["Elm",3],["Tcl",3],["Max",3],["LiveScript",3],["Mathematica",3],["Objective-J",3],["Standard ML",2],["Game Maker Language",2],["Racket",2],["Nix",2],["Vala",2],["Smalltalk",2],["Bluespec",1],["Pure Data",1],["Red",1],["M",1],["Scilab",1],["Mercury",1],["VCL",1],["Frege",1],["wisp",1],["Awk",1],["EmberScript",1],["Nimrod",1],["FLUX",1],["ATS",1],["Xtend",1],["Lasso",1],["Mirah",1],["Factor",1],["AspectJ",1],["XML",1],["Bison",1],["Clean",1],["DOT",1],["SuperCollider",1],["ooc",1],["AutoHotkey",1],["nesC",1],["Apex",1],["Fantom",1],["Gnuplot",1]],"countryCode3":"JPN","countryCode2":"JP","countryName":"Japan","hourlyWage":9.18},"KEN":{"2013":122,"2014":230,"fillKey":"JavaScript","allLangs":[["JavaScript",99],["Python",65],["PHP",64],["Java",52],["CSS",47],["Ruby",19],["Shell",15],["C",14],["Go",14],["C++",13],["C#",10],["Clojure",8],["CoffeeScript",7],["R",5],["Objective-C",5],["VimL",3],["Groovy",2],["FORTRAN",2],["TypeScript",2],["Arduino",2],["Emacs Lisp",1],["Perl",1],["TeX",1],["Assembly",1],["Puppet",1],["Julia",1],["OCaml",1],["Swift",1],["Visual Basic",1],["Makefile",1],["Processing",1],["Rust",1],["Vala",1]],"countryCode3":"KEN","countryCode2":"KE","countryName":"Kenya","hourlyWage":9.3},"KGZ":{"2013":31,"2014":53,"fillKey":"JavaScript","allLangs":[["JavaScript",19],["Java",12],["Ruby",12],["PHP",11],["C++",7],["Python",7],["CSS",7],["C",7],["Objective-C",5],["C#",4],["VimL",4],["Go",4],["CoffeeScript",2],["Haskell",1],["ActionScript",1],["Swift",1],["TypeScript",1],["Crystal",1],["Shell",1]],"countryCode3":"KGZ","countryCode2":"KG","countryName":"Kyrgyzstan","hourlyWage":0},"KHM":{"2013":32,"2014":64,"fillKey":"JavaScript","allLangs":[["JavaScript",29],["PHP",20],["CSS",15],["Java",10],["Ruby",10],["Objective-C",8],["Shell",7],["Python",5],["C#",4],["C",3],["Swift",3],["C++",2],["TeX",1],["Matlab",1],["VimL",1],["Erlang",1],["CoffeeScript",1],["Go",1]],"countryCode3":"KHM","countryCode2":"KH","countryName":"Cambodia","hourlyWage":0},"COM":{"2013":1,"2014":1,"fillKey":"CoffeeScript","allLangs":[["CoffeeScript",1]],"countryCode3":"COM","countryCode2":"KM","countryName":"Comoros","hourlyWage":1.34},"PRK":{"2013":1,"2014":1,"fillKey":"Java","allLangs":[["Java",1]],"countryCode3":"PRK","countryCode2":"KP","countryName":"Korea, Democratic People's Republic Of"},"KOR":{"2013":1007,"2014":1559,"fillKey":"JavaScript","allLangs":[["JavaScript",577],["Java",478],["Python",304],["CSS",276],["C",230],["C++",225],["Objective-C",162],["Ruby",144],["Shell",140],["Scala",126],["PHP",124],["Go",92],["C#",92],["CoffeeScript",50],["Swift",48],["VimL",45],["OCaml",35],["Rust",22],["TeX",22],["R",20],["Emacs Lisp",20],["Perl",17],["Clojure",16],["Groovy",14],["Lua",11],["Matlab",10],["TypeScript",9],["Haskell",9],["PowerShell",8],["Visual Basic",8],["Elixir",8],["Assembly",6],["ActionScript",6],["Makefile",6],["Julia",5],["Erlang",5],["XSLT",5],["Arduino",4],["Common Lisp",4],["D",4],["Pascal",4],["Dart",3],["Scheme",3],["FORTRAN",3],["AGS Script",2],["Racket",2],["AutoHotkey",2],["Logos",2],["ASP",2],["Puppet",2],["Crystal",2],["OpenEdge ABL",1],["Bison",1],["IDL",1],["Zephir",1],["Objective-J",1],["EmberScript",1],["Nix",1],["OpenSCAD",1],["Processing",1],["Ragel in Ruby Host",1],["Verilog",1],["Haxe",1],["SQL",1]],"countryCode3":"KOR","countryCode2":"KR","countryName":"Korea, Republic Of","hourlyWage":4.52},"KWT":{"2013":15,"2014":28,"fillKey":"JavaScript","allLangs":[["JavaScript",10],["Java",8],["Python",7],["Shell",6],["Ruby",4],["PHP",3],["CSS",3],["C#",2],["Objective-C",2],["Scala",2],["VimL",2],["R",1],["C++",1],["AGS Script",1]],"countryCode3":"KWT","countryCode2":"KW","countryName":"Kuwait","hourlyWage":13.42},"CYM":{"2013":4,"2014":2,"fillKey":"Java","allLangs":[["Java",1],["Vala",1],["C",1],["Python",1],["JavaScript",1],["C#",1],["Ruby",1],["Objective-C",1]],"countryCode3":"CYM","countryCode2":"KY","countryName":"Cayman Islands","hourlyWage":0},"KAZ":{"2013":68,"2014":141,"fillKey":"JavaScript","allLangs":[["JavaScript",58],["PHP",32],["CSS",31],["Java",28],["Python",22],["Ruby",16],["C++",14],["C",13],["C#",10],["Shell",8],["Objective-C",6],["CoffeeScript",6],["Scala",4],["Clojure",3],["Go",3],["TypeScript",3],["Verilog",2],["Swift",2],["Pascal",2],["Elixir",2],["Objective-C++",2],["Crystal",1],["Groovy",1],["Nimrod",1],["PAWN",1],["R",1],["SQL",1],["Emacs Lisp",1],["LabVIEW",1],["Objective-J",1],["PowerShell",1],["Perl",1],["Arduino",1],["Makefile",1],["VimL",1],["Rust",1]],"countryCode3":"KAZ","countryCode2":"KZ","countryName":"Kazakhstan","hourlyWage":2.8},"LAO":{"2013":1,"2014":1,"fillKey":"OCaml","allLangs":[["OCaml",1],["CSS",1],["Ruby",1],["Java",1]],"countryCode3":"LAO","countryCode2":"LA","countryName":"Lao People's Democratic Republic"},"LBN":{"2013":33,"2014":62,"fillKey":"JavaScript","allLangs":[["JavaScript",29],["PHP",15],["CSS",12],["Python",11],["Java",11],["C",8],["C#",7],["C++",6],["Objective-C",6],["CoffeeScript",4],["Lua",3],["VimL",2],["Go",2],["OCaml",2],["Swift",2],["Shell",2],["Ruby",1],["TeX",1],["ActionScript",1]],"countryCode3":"LBN","countryCode2":"LB","countryName":"Lebanon","hourlyWage":0},"LCA":{"2013":1,"2014":2,"fillKey":"CSS","allLangs":[["CSS",1],["PHP",1]],"countryCode3":"LCA","countryCode2":"LC","countryName":"Saint Lucia","hourlyWage":11.54},"LIE":{"2013":1,"2014":2,"fillKey":"JavaScript","allLangs":[["JavaScript",1],["C",1],["Ruby",1],["Puppet",1],["C++",1],["Shell",1],["Python",1]],"countryCode3":"LIE","countryCode2":"LI","countryName":"Liechtenstein","hourlyWage":0},"LKA":{"2013":141,"2014":300,"fillKey":"JavaScript","allLangs":[["JavaScript",124],["Java",119],["PHP",58],["CSS",48],["Python",30],["C++",20],["C#",15],["CoffeeScript",15],["C",14],["Ruby",14],["Shell",12],["Objective-C",11],["Go",8],["Swift",5],["VimL",5],["R",3],["Puppet",3],["Processing",3],["Scala",3],["TeX",2],["PowerShell",2],["Perl",2],["F#",1],["Groovy",1],["OCaml",1],["XSLT",1],["Clojure",1],["FORTRAN",1],["Nemerle",1],["TypeScript",1],["Emacs Lisp",1]],"countryCode3":"LKA","countryCode2":"LK","countryName":"Sri Lanka","hourlyWage":0},"LSO":{"2013":2,"2014":1,"fillKey":"Java","allLangs":[["Java",1],["CSS",1]],"countryCode3":"LSO","countryCode2":"LS","countryName":"Lesotho","hourlyWage":0},"LTU":{"2013":227,"2014":366,"fillKey":"JavaScript","allLangs":[["JavaScript",124],["PHP",78],["Python",63],["CSS",55],["Java",46],["C",42],["Ruby",39],["Shell",39],["C#",34],["C++",34],["Go",24],["VimL",21],["CoffeeScript",12],["Objective-C",10],["Perl",8],["Scala",7],["Haskell",5],["OCaml",5],["Clojure",5],["Groovy",4],["Puppet",4],["PowerShell",3],["Lua",3],["Prolog",3],["Rust",3],["R",3],["Julia",2],["Swift",2],["Makefile",2],["Dart",2],["Matlab",2],["AppleScript",1],["Stata",1],["XSLT",1],["Erlang",1],["Haxe",1],["Bison",1],["Vala",1],["Elixir",1],["Arduino",1],["D",1],["F#",1],["ActionScript",1],["Crystal",1],["Emacs Lisp",1],["Kotlin",1],["Assembly",1],["SAS",1],["TeX",1]],"countryCode3":"LTU","countryCode2":"LT","countryName":"Lithuania","hourlyWage":2.18},"LUX":{"2013":74,"2014":136,"fillKey":"JavaScript","allLangs":[["JavaScript",62],["Java",30],["Python",27],["PHP",26],["Shell",16],["Ruby",14],["CSS",10],["C++",9],["C#",8],["C",8],["Objective-C",7],["Go",5],["VimL",3],["Scala",3],["Swift",2],["TeX",2],["Objective-C++",1],["Prolog",1],["XSLT",1],["CoffeeScript",1],["Matlab",1],["Emacs Lisp",1],["OCaml",1],["Puppet",1],["AppleScript",1],["Groovy",1],["PowerShell",1],["Visual Basic",1],["F#",1],["Lua",1],["Perl",1],["Dart",1]],"countryCode3":"LUX","countryCode2":"LU","countryName":"Luxembourg","hourlyWage":55.88},"LVA":{"2013":204,"2014":263,"fillKey":"JavaScript","allLangs":[["JavaScript",117],["PHP",63],["Ruby",55],["Python",48],["CSS",42],["Java",40],["C",33],["C++",32],["Shell",24],["Go",17],["Objective-C",16],["VimL",15],["CoffeeScript",13],["C#",12],["Perl",5],["Scala",4],["TypeScript",4],["Swift",4],["Rust",4],["R",3],["OCaml",3],["Clojure",3],["D",2],["PowerShell",2],["Groovy",2],["Julia",1],["OpenEdge ABL",1],["Assembly",1],["Visual Basic",1],["Lua",1],["Agda",1],["Verilog",1],["Emacs Lisp",1],["Prolog",1],["Tcl",1],["Makefile",1],["Racket",1],["ANTLR",1],["SourcePawn",1],["F#",1]],"countryCode3":"LVA","countryCode2":"LV","countryName":"Latvia","hourlyWage":3.08},"LBY":{"2013":3,"2014":5,"fillKey":"CSS","allLangs":[["CSS",2],["JavaScript",2],["C",2],["Ruby",1],["PHP",1]],"countryCode3":"LBY","countryCode2":"LY","countryName":"Libya","hourlyWage":0},"MAR":{"2013":66,"2014":135,"fillKey":"JavaScript","allLangs":[["JavaScript",61],["CSS",38],["PHP",35],["Java",31],["Python",30],["C",16],["C++",15],["Ruby",13],["Shell",12],["CoffeeScript",9],["Go",7],["Objective-C",4],["C#",3],["Groovy",3],["VimL",2],["Assembly",2],["TeX",2],["Visual Basic",2],["Arduino",2],["Lua",1],["Rust",1],["Dart",1],["OCaml",1],["Matlab",1],["PowerShell",1],["Scala",1],["FORTRAN",1],["Lasso",1],["Perl",1],["TypeScript",1],["Puppet",1]],"countryCode3":"MAR","countryCode2":"MA","countryName":"Morocco","hourlyWage":0},"MCO":{"2013":2,"2014":4,"fillKey":"PHP","allLangs":[["PHP",4],["JavaScript",3],["CSS",3],["R",1],["Perl",1],["Java",1],["C++",1]],"countryCode3":"MCO","countryCode2":"MC","countryName":"Monaco","hourlyWage":0},"MDA":{"2013":79,"2014":120,"fillKey":"JavaScript","allLangs":[["JavaScript",65],["PHP",34],["CSS",22],["Ruby",21],["C++",14],["Java",13],["Objective-C",12],["Python",11],["C#",8],["Shell",8],["C",8],["Go",7],["VimL",4],["CoffeeScript",3],["Rust",3],["PowerShell",2],["Swift",2],["Erlang",1],["Perl",1],["XSLT",1],["Haxe",1],["Objective-C++",1],["VCL",1],["F#",1],["Matlab",1],["D",1],["PAWN",1]],"countryCode3":"MDA","countryCode2":"MD","countryName":"Moldova","hourlyWage":0.86},"MNE":{"2013":6,"2014":16,"fillKey":"JavaScript","allLangs":[["JavaScript",7],["Java",3],["Python",3],["PHP",2],["C",2],["CSS",2],["C++",2],["Ruby",2],["CoffeeScript",1],["Shell",1],["Swift",1],["ActionScript",1],["Haxe",1]],"countryCode3":"MNE","countryCode2":"ME","countryName":"Montenegro","hourlyWage":0},"MDG":{"2013":11,"2014":24,"fillKey":"JavaScript","allLangs":[["JavaScript",13],["PHP",12],["Python",6],["CSS",5],["C",2],["Ruby",2],["C++",2],["Java",2],["Assembly",1],["Objective-C",1],["Rust",1],["CoffeeScript",1],["R",1],["Go",1],["Scala",1],["Common Lisp",1],["Nimrod",1]],"countryCode3":"MDG","countryCode2":"MG","countryName":"Madagascar","hourlyWage":0.7},"MHL":{"2013":1,"2014":1,"fillKey":"Ruby","allLangs":[["Ruby",1],["Java",1]],"countryCode3":"MHL","countryCode2":"MH","countryName":"Marshall Islands"},"MKD":{"2013":57,"2014":84,"fillKey":"JavaScript","allLangs":[["JavaScript",37],["Java",21],["CSS",18],["Python",14],["PHP",14],["Ruby",10],["C++",9],["C#",9],["C",7],["Shell",6],["Objective-C",3],["OCaml",3],["VimL",3],["Swift",2],["Go",2],["Clojure",2],["R",2],["Elixir",1],["Crystal",1],["Perl",1],["Scala",1],["Xojo",1],["Emacs Lisp",1],["TypeScript",1],["ActionScript",1],["CoffeeScript",1],["Erlang",1]],"countryCode3":"MKD","countryCode2":"MK","countryName":"Macedonia, The Former Yugoslav Republic Of","hourlyWage":0},"MLI":{"2013":3,"2014":7,"fillKey":"Java","allLangs":[["Java",4],["Python",4],["PHP",1],["C++",1]],"countryCode3":"MLI","countryCode2":"ML","countryName":"Mali","hourlyWage":0},"MMR":{"2013":31,"2014":51,"fillKey":"JavaScript","allLangs":[["JavaScript",26],["Java",13],["CSS",12],["PHP",11],["Go",8],["Ruby",7],["C#",7],["C",6],["Python",6],["C++",5],["Shell",4],["Objective-C",4],["Scala",3],["VimL",3],["Elixir",2],["R",1],["Swift",1],["Visual Basic",1],["TeX",1],["CoffeeScript",1],["Groovy",1],["XSLT",1],["Emacs Lisp",1],["Rust",1]],"countryCode3":"MMR","countryCode2":"MM","countryName":"Myanmar","hourlyWage":2.16},"MNG":{"2013":19,"2014":27,"fillKey":"JavaScript","allLangs":[["JavaScript",11],["CSS",6],["PHP",6],["Python",5],["VimL",5],["CoffeeScript",4],["Java",4],["Ruby",4],["C",3],["Go",2],["Objective-C",2],["C++",2],["Scala",1],["C#",1]],"countryCode3":"MNG","countryCode2":"MN","countryName":"Mongolia","hourlyWage":0},"MAC":{"2013":12,"2014":18,"fillKey":"JavaScript","allLangs":[["JavaScript",9],["CSS",5],["Python",4],["Objective-C",3],["Java",3],["Ruby",3],["Shell",2],["R",2],["CoffeeScript",2],["PHP",2],["Clojure",1],["TeX",1],["C#",1]],"countryCode3":"MAC","countryCode2":"MO","countryName":"Macao","hourlyWage":0},"MTQ":{"2013":4,"2014":2,"fillKey":"CSS","allLangs":[["CSS",1],["JavaScript",1],["PHP",1]],"countryCode3":"MTQ","countryCode2":"MQ","countryName":"Martinique","hourlyWage":0},"MRT":{"2013":1,"2014":1,"fillKey":"Ruby","allLangs":[["Ruby",1]],"countryCode3":"MRT","countryCode2":"MR","countryName":"Mauritania","hourlyWage":0},"MLT":{"2013":19,"2014":45,"fillKey":"JavaScript","allLangs":[["JavaScript",22],["CSS",11],["PHP",9],["Python",8],["Objective-C",5],["Shell",5],["C#",5],["Java",4],["Ruby",4],["Go",3],["TypeScript",2],["C",2],["XSLT",2],["CoffeeScript",2],["OCaml",2],["C++",2],["Elixir",1],["Lua",1],["VHDL",1],["Erlang",1],["Nemerle",1],["Puppet",1],["SQF",1],["ActionScript",1],["Perl",1],["Scala",1],["VimL",1]],"countryCode3":"MLT","countryCode2":"MT","countryName":"Malta","hourlyWage":0},"MUS":{"2013":16,"2014":20,"fillKey":"PHP","allLangs":[["PHP",11],["JavaScript",11],["Objective-C",3],["Java",2],["TypeScript",2],["Shell",2],["CSS",2],["Python",2],["C#",1],["Tcl",1],["Ruby",1],["C++",1],["C",1]],"countryCode3":"MUS","countryCode2":"MU","countryName":"Mauritius","hourlyWage":0},"MDV":{"2013":6,"2014":10,"fillKey":"JavaScript","allLangs":[["JavaScript",8],["Ruby",3],["Java",2],["PHP",2],["Shell",2],["Objective-C",1],["Swift",1],["CSS",1],["Erlang",1],["Python",1],["CoffeeScript",1]],"countryCode3":"MDV","countryCode2":"MV","countryName":"Maldives","hourlyWage":0},"MWI":{"2013":7,"2014":8,"fillKey":"Ruby","allLangs":[["Ruby",5],["JavaScript",4],["Python",2]],"countryCode3":"MWI","countryCode2":"MW","countryName":"Malawi","hourlyWage":5.86},"MEX":{"2013":679,"2014":980,"fillKey":"JavaScript","allLangs":[["JavaScript",395],["CSS",216],["Java",174],["PHP",163],["Python",152],["Ruby",132],["Objective-C",76],["C",72],["Shell",66],["C++",62],["C#",44],["CoffeeScript",30],["Go",29],["VimL",27],["R",18],["Swift",18],["TeX",14],["Perl",12],["Emacs Lisp",9],["Lua",8],["Groovy",7],["Scala",7],["PowerShell",6],["Arduino",6],["Haskell",6],["Assembly",5],["Erlang",5],["Rust",5],["Vala",4],["Prolog",4],["Clojure",4],["Julia",4],["Puppet",4],["Elixir",4],["Haxe",3],["Visual Basic",3],["Matlab",3],["Processing",3],["Mathematica",2],["Crystal",2],["F#",2],["Objective-C++",2],["TypeScript",2],["Makefile",2],["XSLT",2],["ASP",2],["Cuda",2],["Stata",1],["AGS Script",1],["OpenEdge ABL",1],["Racket",1],["DM",1],["Scilab",1],["D",1],["SAS",1],["SuperCollider",1],["VHDL",1],["Gnuplot",1],["ActionScript",1],["OCaml",1],["Dart",1],["Logos",1],["Ceylon",1],["Pure Data",1],["Elm",1]],"countryCode3":"MEX","countryCode2":"MX","countryName":"Mexico","hourlyWage":7},"MYS":{"2013":249,"2014":380,"fillKey":"JavaScript","allLangs":[["JavaScript",163],["CSS",104],["Java",76],["PHP",73],["Python",72],["Ruby",64],["C",43],["C++",41],["Shell",39],["Objective-C",34],["C#",22],["Go",21],["CoffeeScript",17],["VimL",12],["Swift",11],["Scala",10],["Perl",7],["Lua",6],["OCaml",5],["Makefile",5],["Elixir",4],["Matlab",3],["PowerShell",3],["Clojure",3],["Assembly",2],["Visual Basic",2],["Rust",2],["R",2],["Kotlin",1],["AGS Script",1],["Puppet",1],["Cuda",1],["TypeScript",1],["Emacs Lisp",1],["Haxe",1],["AppleScript",1],["D",1],["Groovy",1],["Julia",1],["Processing",1],["VCL",1],["Erlang",1],["Arduino",1],["Haskell",1]],"countryCode3":"MYS","countryCode2":"MY","countryName":"Malaysia","hourlyWage":0},"MOZ":{"2013":2,"2014":5,"fillKey":"JavaScript","allLangs":[["JavaScript",3],["Java",1],["Ruby",1],["CoffeeScript",1],["Python",1],["Swift",1],["CSS",1],["R",1],["C++",1],["Objective-C",1]],"countryCode3":"MOZ","countryCode2":"MZ","countryName":"Mozambique","hourlyWage":0.94},"NAM":{"2013":6,"2014":16,"fillKey":"JavaScript","allLangs":[["JavaScript",8],["Java",6],["C#",4],["C",3],["Ruby",3],["Python",2],["PHP",2],["Shell",2],["VimL",1],["CSS",1]],"countryCode3":"NAM","countryCode2":"NA","countryName":"Namibia","hourlyWage":17.18},"NCL":{"2013":2,"2014":1,"fillKey":"Java","allLangs":[["Java",1],["Go",1]],"countryCode3":"NCL","countryCode2":"NC","countryName":"New Caledonia","hourlyWage":0},"NGA":{"2013":60,"2014":152,"fillKey":"JavaScript","allLangs":[["JavaScript",74],["PHP",46],["CSS",39],["Java",32],["Python",19],["C#",11],["Shell",9],["C++",9],["CoffeeScript",9],["Ruby",7],["Objective-C",6],["C",4],["R",2],["Swift",2],["ActionScript",2],["OCaml",2],["Go",2],["Perl",2],["Groovy",1],["Vala",1],["Haskell",1],["VimL",1],["TypeScript",1],["Arduino",1],["ColdFusion",1],["Haxe",1]],"countryCode3":"NGA","countryCode2":"NG","countryName":"Nigeria","hourlyWage":6.24},"NIC":{"2013":28,"2014":53,"fillKey":"JavaScript","allLangs":[["JavaScript",27],["PHP",12],["Python",10],["Java",10],["CSS",9],["Ruby",8],["Shell",6],["C#",5],["C++",3],["C",2],["VimL",2],["CoffeeScript",2],["Objective-C",2],["TeX",2],["Go",1],["Visual Basic",1],["TypeScript",1]],"countryCode3":"NIC","countryCode2":"NI","countryName":"Nicaragua","hourlyWage":6.82},"NLD":{"2013":3093,"2014":4746,"fillKey":"JavaScript","allLangs":[["JavaScript",1774],["PHP",940],["Python",853],["Java",765],["CSS",755],["Ruby",522],["Shell",503],["C",477],["C++",433],["C#",345],["Objective-C",214],["Go",213],["CoffeeScript",156],["VimL",131],["Scala",109],["Perl",102],["R",81],["TeX",73],["Swift",63],["Haskell",62],["Clojure",51],["Puppet",43],["Emacs Lisp",37],["Groovy",37],["OCaml",37],["TypeScript",35],["Lua",34],["Rust",27],["Arduino",25],["PowerShell",19],["Erlang",19],["Matlab",18],["ActionScript",14],["Processing",14],["Scheme",13],["Assembly",13],["XSLT",13],["F#",11],["Julia",11],["Visual Basic",11],["Makefile",10],["Common Lisp",9],["Nix",8],["D",8],["Vala",8],["Haxe",8],["Prolog",7],["Elixir",7],["OpenSCAD",7],["Pascal",6],["FORTRAN",5],["Kotlin",4],["Objective-C++",4],["Game Maker Language",4],["PureScript",4],["AGS Script",4],["IDL",4],["LiveScript",4],["SQF",4],["VHDL",4],["Elm",3],["Apex",3],["DM",3],["Gnuplot",3],["XQuery",3],["Perl6",3],["Dart",3],["Tcl",2],["VCL",2],["Max",2],["Gosu",2],["Xtend",2],["BlitzBasic",2],["Objective-J",2],["Mercury",2],["Crystal",2],["ANTLR",2],["ColdFusion",2],["PAWN",2],["ASP",2],["Awk",1],["M",1],["Monkey",1],["Smalltalk",1],["Parrot",1],["Harbour",1],["XML",1],["AutoHotkey",1],["LSL",1],["REALbasic",1],["SuperCollider",1],["OpenEdge ABL",1],["UnrealScript",1],["Lasso",1],["Racket",1],["SAS",1],["Nemerle",1],["SourcePawn",1],["Verilog",1],["AutoIt",1],["Zephir",1],["Augeas",1],["Ragel in Ruby Host",1],["NetLogo",1]],"countryCode3":"NLD","countryCode2":"NL","countryName":"Netherlands","hourlyWage":0},"NOR":{"2013":1181,"2014":1763,"fillKey":"JavaScript","allLangs":[["JavaScript",653],["Python",314],["Java",311],["CSS",282],["Shell",191],["PHP",184],["C++",183],["C",181],["C#",166],["Ruby",164],["VimL",78],["Go",74],["Objective-C",66],["CoffeeScript",48],["Scala",38],["Perl",36],["Clojure",32],["TeX",32],["Emacs Lisp",31],["OCaml",28],["Lua",25],["Swift",22],["XSLT",18],["TypeScript",18],["R",18],["Haskell",16],["Puppet",12],["Rust",12],["Erlang",11],["Arduino",10],["Groovy",9],["PowerShell",9],["F#",8],["Visual Basic",8],["Elixir",8],["Matlab",7],["Scheme",7],["Makefile",6],["Common Lisp",6],["Julia",5],["ActionScript",5],["ASP",4],["Nix",3],["VHDL",3],["Vala",3],["Dart",3],["D",2],["Game Maker Language",2],["Assembly",2],["LiveScript",2],["wisp",2],["Haxe",2],["VCL",1],["Coq",1],["Objective-C++",1],["DM",1],["Perl6",1],["Standard ML",1],["ColdFusion",1],["Pascal",1],["Processing",1],["Racket",1],["Hy",1],["Tcl",1],["Max",1],["FORTRAN",1],["SuperCollider",1],["Prolog",1],["IDL",1],["SourcePawn",1],["AutoIt",1],["Logos",1],["nesC",1],["Cycript",1],["Parrot",1],["Elm",1],["Frege",1]],"countryCode3":"NOR","countryCode2":"NO","countryName":"Norway","hourlyWage":0},"NPL":{"2013":111,"2014":199,"fillKey":"JavaScript","allLangs":[["JavaScript",75],["PHP",59],["Java",52],["CSS",44],["Python",29],["Ruby",24],["C",20],["C++",16],["Shell",14],["Objective-C",7],["CoffeeScript",6],["Go",3],["Puppet",2],["VimL",2],["Arduino",2],["Clojure",2],["Groovy",2],["C#",2],["Emacs Lisp",2],["PowerShell",2],["TypeScript",2],["OCaml",2],["R",1],["Swift",1],["Nix",1],["Scala",1],["TeX",1],["XSLT",1],["Rust",1],["ASP",1],["Haskell",1]],"countryCode3":"NPL","countryCode2":"NP","countryName":"Nepal","hourlyWage":0},"NIU":{"2013":1,"2014":1,"fillKey":"C#","allLangs":[["C#",1],["Ruby",1],["CSS",1],["JavaScript",1]],"countryCode3":"NIU","countryCode2":"NU","countryName":"Niue"},"NZL":{"2013":861,"2014":1344,"fillKey":"JavaScript","allLangs":[["JavaScript",514],["Python",237],["CSS",223],["PHP",216],["Ruby",197],["Java",168],["C",138],["C++",129],["C#",119],["Shell",118],["Objective-C",71],["Go",59],["CoffeeScript",45],["VimL",36],["R",26],["Perl",26],["Rust",23],["TeX",22],["OCaml",19],["Swift",16],["Clojure",15],["Emacs Lisp",15],["Scala",15],["Haskell",14],["PowerShell",10],["Groovy",10],["TypeScript",10],["Lua",9],["F#",8],["Scheme",7],["D",6],["Arduino",6],["Visual Basic",6],["Puppet",5],["Julia",5],["FORTRAN",5],["Erlang",5],["Elixir",4],["ActionScript",4],["Dart",3],["Crystal",2],["DM",2],["HaXe",2],["XSLT",2],["ASP",2],["Kotlin",2],["Nix",2],["Verilog",2],["Makefile",2],["Elm",1],["Frege",1],["AGS Script",1],["Grace",1],["Assembly",1],["Idris",1],["Lasso",1],["Volt",1],["Common Lisp",1],["Matlab",1],["Processing",1],["Game Maker Language",1],["Racket",1],["ANTLR",1],["AutoHotkey",1],["Objective-C++",1],["PigLatin",1],["Gosu",1],["IDL",1],["Tcl",1],["Coq",1],["Delphi",1],["Perl6",1],["Prolog",1],["Gnuplot",1],["Apex",1],["Standard ML",1],["ColdFusion",1]],"countryCode3":"NZL","countryCode2":"NZ","countryName":"New Zealand","hourlyWage":10.98},"OMN":{"2013":4,"2014":5,"fillKey":"Java","allLangs":[["Java",5],["Ruby",2],["Objective-C",1],["Python",1],["C++",1],["JavaScript",1],["CSS",1],["C",1]],"countryCode3":"OMN","countryCode2":"OM","countryName":"Oman","hourlyWage":0},"PAN":{"2013":34,"2014":43,"fillKey":"JavaScript","allLangs":[["JavaScript",18],["Java",9],["Python",8],["PHP",6],["Ruby",5],["C++",4],["CSS",3],["C",3],["C#",2],["Puppet",2],["VimL",2],["Shell",1],["Haxe",1],["Objective-C",1],["Scala",1]],"countryCode3":"PAN","countryCode2":"PA","countryName":"Panama","hourlyWage":0},"PER":{"2013":133,"2014":171,"fillKey":"JavaScript","allLangs":[["JavaScript",70],["PHP",43],["CSS",36],["Python",35],["Java",28],["Ruby",15],["C++",13],["Shell",11],["C#",9],["C",8],["VimL",5],["Objective-C",4],["CoffeeScript",4],["Go",3],["R",3],["Emacs Lisp",2],["Swift",2],["Scala",2],["OCaml",2],["Dart",2],["Visual Basic",2],["Perl",1],["VHDL",1],["Assembly",1],["TeX",1],["Lua",1],["Puppet",1],["ASP",1]],"countryCode3":"PER","countryCode2":"PE","countryName":"Peru","hourlyWage":1.12},"PYF":{"2013":4,"2014":4,"fillKey":"Shell","allLangs":[["Shell",2],["JavaScript",2],["F#",1],["C#",1],["Python",1],["CSS",1],["Ruby",1],["PHP",1]],"countryCode3":"PYF","countryCode2":"PF","countryName":"French Polynesia","hourlyWage":26.76},"PNG":{"2013":1,"2014":1,"fillKey":"JavaScript","allLangs":[["JavaScript",1]],"countryCode3":"PNG","countryCode2":"PG","countryName":"Papua New Guinea","hourlyWage":5.7},"PHL":{"2013":486,"2014":740,"fillKey":"JavaScript","allLangs":[["JavaScript",314],["PHP",178],["CSS",157],["Java",109],["Python",108],["Ruby",96],["C++",59],["Shell",59],["C",55],["Go",51],["Objective-C",47],["C#",38],["VimL",31],["CoffeeScript",24],["Swift",14],["R",14],["Scala",7],["Perl",7],["OCaml",7],["TeX",6],["Visual Basic",5],["PowerShell",5],["TypeScript",5],["Groovy",5],["Haskell",4],["Lua",4],["Haxe",4],["Emacs Lisp",4],["Erlang",3],["Rust",3],["Clojure",3],["ActionScript",3],["Puppet",3],["Dart",2],["Matlab",2],["ColdFusion",2],["Elixir",2],["Assembly",2],["Common Lisp",2],["FORTRAN",1],["ASP",1],["VCL",1],["Pascal",1],["Apex",1],["Thrift",1],["Zephir",1],["Tcl",1],["D",1],["F#",1],["Mathematica",1],["Arduino",1],["Stata",1],["Julia",1],["AutoIt",1]],"countryCode3":"PHL","countryCode2":"PH","countryName":"Philippines","hourlyWage":3.68},"PAK":{"2013":208,"2014":379,"fillKey":"JavaScript","allLangs":[["JavaScript",158],["PHP",77],["Java",63],["CSS",52],["Python",50],["C#",43],["Ruby",36],["C++",34],["Objective-C",29],["C",21],["CoffeeScript",17],["Shell",16],["Swift",9],["Scala",6],["OCaml",5],["Go",5],["VimL",4],["PowerShell",3],["R",3],["TypeScript",2],["Groovy",2],["FORTRAN",2],["D",2],["ActionScript",2],["Cuda",1],["Makefile",1],["Perl",1],["Arduino",1],["Processing",1],["Rust",1],["Haskell",1],["Matlab",1],["ASP",1],["Pascal",1],["Puppet",1],["Visual Basic",1],["Elixir",1],["IDL",1]],"countryCode3":"PAK","countryCode2":"PK","countryName":"Pakistan","hourlyWage":1.76},"POL":{"2013":1526,"2014":2429,"fillKey":"JavaScript","allLangs":[["JavaScript",806],["Java",482],["Python",421],["CSS",369],["PHP",353],["Ruby",345],["C#",309],["C++",299],["C",243],["Shell",213],["Objective-C",112],["VimL",87],["Scala",85],["CoffeeScript",82],["Go",79],["Groovy",45],["Swift",38],["Clojure",34],["Perl",34],["OCaml",29],["TeX",29],["R",26],["Lua",23],["Emacs Lisp",22],["Erlang",18],["TypeScript",17],["Haskell",16],["Rust",14],["Assembly",11],["D",10],["PowerShell",9],["Makefile",8],["Haxe",8],["Puppet",7],["Arduino",7],["Matlab",7],["Visual Basic",6],["Pascal",6],["Elixir",6],["ActionScript",5],["F#",5],["Prolog",5],["PureScript",5],["AGS Script",4],["Standard ML",4],["Crystal",4],["XSLT",3],["Perl6",3],["Dart",3],["SQF",3],["Objective-C++",3],["Scheme",3],["Kotlin",3],["Processing",2],["IDL",2],["LiveScript",2],["Verilog",2],["Ada",2],["ASP",2],["VHDL",2],["AppleScript",2],["Vala",2],["Rebol",1],["PAWN",1],["Elm",1],["Frege",1],["BlitzBasic",1],["NetLogo",1],["OpenEdge ABL",1],["Pure Data",1],["Apex",1],["Julia",1],["AutoHotkey",1],["Mathematica",1],["Cuda",1],["Nix",1],["FLUX",1],["SQL",1],["Awk",1]],"countryCode3":"POL","countryCode2":"PL","countryName":"Poland","hourlyWage":6.18},"PRI":{"2013":59,"2014":84,"fillKey":"JavaScript","allLangs":[["JavaScript",34],["Python",21],["CSS",20],["Java",16],["Ruby",15],["C#",10],["C++",10],["CoffeeScript",7],["Objective-C",7],["Shell",7],["PHP",7],["C",6],["Go",4],["Swift",4],["Groovy",3],["OCaml",2],["Erlang",2],["Makefile",2],["PowerShell",2],["R",2],["F#",2],["TeX",1],["IDL",1],["Rust",1],["Visual Basic",1],["ASP",1],["Julia",1],["Perl",1],["Tcl",1],["Prolog",1],["D",1],["Haxe",1],["Kotlin",1]],"countryCode3":"PRI","countryCode2":"PR","countryName":"Puerto Rico","hourlyWage":18.22},"PSE":{"2013":12,"2014":19,"fillKey":"JavaScript","allLangs":[["JavaScript",8],["Ruby",5],["CSS",4],["PHP",3],["Java",3],["Perl",2],["Objective-C",2],["Go",1],["VimL",1],["C#",1],["Haskell",1],["Swift",1],["C",1],["Python",1]],"countryCode3":"PSE","countryCode2":"PS","countryName":"Palestinian Territory, Occupied","hourlyWage":0},"PRT":{"2013":795,"2014":1255,"fillKey":"JavaScript","allLangs":[["JavaScript",485],["CSS",266],["Java",251],["Python",216],["PHP",175],["Ruby",173],["C",148],["C++",144],["Shell",139],["C#",97],["Objective-C",89],["Go",62],["CoffeeScript",50],["Swift",35],["VimL",35],["Perl",24],["OCaml",23],["Scala",21],["Clojure",19],["TeX",17],["TypeScript",11],["Emacs Lisp",11],["Prolog",10],["Haskell",9],["Erlang",8],["R",7],["Lua",7],["Common Lisp",7],["Elixir",7],["Max",6],["Rust",6],["Puppet",5],["Visual Basic",5],["ActionScript",4],["Vala",4],["D",4],["Arduino",4],["FORTRAN",3],["Haxe",3],["Scheme",3],["Makefile",3],["Objective-C++",3],["Processing",3],["Groovy",3],["XSLT",2],["Pascal",2],["PowerShell",2],["Logos",2],["Dylan",2],["Racket",2],["Assembly",2],["Nimrod",2],["Matlab",2],["Dart",1],["ASP",1],["PureScript",1],["IDL",1],["AppleScript",1],["BlitzBasic",1],["OpenEdge ABL",1],["Perl6",1],["Game Maker Language",1],["Julia",1],["PAWN",1],["Logtalk",1],["OpenSCAD",1],["Gnuplot",1],["Pure Data",1],["Hy",1],["Red",1],["AGS Script",1],["Kotlin",1],["Bison",1],["VCL",1]],"countryCode3":"PRT","countryCode2":"PT","countryName":"Portugal","hourlyWage":18.98},"PRY":{"2013":33,"2014":46,"fillKey":"JavaScript","allLangs":[["JavaScript",16],["Java",13],["CSS",12],["C++",7],["Ruby",7],["Python",7],["C#",7],["PHP",4],["Shell",4],["Objective-C",3],["CoffeeScript",2],["Go",2],["C",2],["Dart",1],["Elixir",1],["Julia",1],["R",1],["Swift",1],["Scala",1],["TeX",1],["Clojure",1],["Groovy",1],["OCaml",1],["Rust",1]],"countryCode3":"PRY","countryCode2":"PY","countryName":"Paraguay","hourlyWage":0},"QAT":{"2013":8,"2014":20,"fillKey":"JavaScript","allLangs":[["JavaScript",9],["Ruby",5],["Python",5],["CSS",4],["Java",3],["C#",2],["Go",2],["Objective-C",2],["Shell",2],["C",2],["Swift",1],["Clojure",1],["CoffeeScript",1],["C++",1],["R",1],["Perl",1]],"countryCode3":"QAT","countryCode2":"QA","countryName":"Qatar","hourlyWage":0},"REU":{"2013":3,"2014":6,"fillKey":"PHP","allLangs":[["PHP",4],["JavaScript",3],["C",2],["Shell",1],["Perl",1]],"countryCode3":"REU","countryCode2":"RE","countryName":"Reunion","hourlyWage":0},"ROU":{"2013":622,"2014":898,"fillKey":"JavaScript","allLangs":[["JavaScript",365],["PHP",177],["Python",165],["Java",163],["CSS",162],["C",106],["Ruby",93],["Shell",89],["C++",88],["C#",53],["Objective-C",45],["Go",37],["CoffeeScript",29],["VimL",25],["Scala",17],["Perl",12],["PowerShell",10],["Swift",9],["OCaml",8],["TeX",7],["Haskell",6],["Prolog",6],["Assembly",5],["F#",5],["Emacs Lisp",5],["Lua",5],["R",5],["XSLT",4],["Clojure",4],["D",4],["Makefile",4],["Rust",4],["Groovy",4],["TypeScript",3],["Matlab",3],["Arduino",3],["ActionScript",3],["Erlang",3],["XQuery",2],["Nemerle",2],["Verilog",2],["Vala",2],["Visual Basic",2],["ASP",2],["Puppet",2],["VCL",1],["Kotlin",1],["Pascal",1],["Processing",1],["Racket",1],["Delphi",1],["SQL",1],["AutoHotkey",1],["PAWN",1],["Elixir",1],["Standard ML",1],["Max",1],["OpenSCAD",1],["Thrift",1],["IDL",1],["VHDL",1],["ANTLR",1],["Objective-C++",1],["AutoIt",1],["Elm",1]],"countryCode3":"ROU","countryCode2":"RO","countryName":"Romania","hourlyWage":2.16},"SRB":{"2013":196,"2014":349,"fillKey":"JavaScript","allLangs":[["JavaScript",135],["PHP",85],["CSS",66],["Java",52],["Python",51],["Ruby",41],["C",33],["Shell",31],["C++",30],["C#",19],["Objective-C",16],["Go",13],["CoffeeScript",12],["VimL",10],["Scala",5],["Swift",4],["TypeScript",4],["Perl",4],["R",4],["Groovy",3],["Lua",3],["Clojure",3],["Emacs Lisp",3],["Ragel in Ruby Host",2],["Assembly",2],["Puppet",2],["ActionScript",2],["Rust",2],["TeX",2],["XSLT",2],["Objective-C++",2],["DM",1],["PAWN",1],["FORTRAN",1],["OCaml",1],["PowerShell",1],["Tcl",1],["Elixir",1],["Visual Basic",1],["Haskell",1],["Vala",1],["Pascal",1],["Haxe",1]],"countryCode3":"SRB","countryCode2":"RS","countryName":"Serbia","hourlyWage":0},"RUS":{"2013":4471,"2014":6475,"fillKey":"JavaScript","allLangs":[["JavaScript",2405],["Python",1159],["PHP",1064],["CSS",992],["Java",985],["C++",913],["Ruby",829],["C",767],["Shell",559],["C#",444],["Objective-C",382],["Go",338],["CoffeeScript",302],["VimL",211],["Scala",135],["Perl",119],["Clojure",91],["Haskell",90],["Swift",89],["OCaml",88],["Lua",87],["Rust",77],["Emacs Lisp",75],["Erlang",75],["TeX",73],["R",46],["TypeScript",45],["Pascal",29],["ActionScript",28],["PowerShell",28],["Groovy",25],["D",24],["XSLT",23],["Haxe",21],["Assembly",19],["Arduino",18],["Elixir",18],["Makefile",15],["F#",14],["Matlab",13],["Puppet",13],["Objective-C++",11],["Visual Basic",11],["Scheme",11],["Nemerle",11],["Common Lisp",10],["AGS Script",9],["Prolog",9],["Nix",7],["Dart",7],["Crystal",6],["FORTRAN",6],["Mathematica",6],["Julia",5],["Kotlin",5],["Verilog",4],["SQF",4],["Agda",4],["AppleScript",4],["LiveScript",3],["DM",3],["MoonScript",3],["BlitzBasic",3],["Max",3],["VHDL",3],["AutoIt",3],["Vala",3],["ASP",3],["Zephir",3],["SourcePawn",3],["Elm",3],["Scilab",2],["Standard ML",2],["Gnuplot",2],["PAWN",2],["PureScript",2],["OpenSCAD",2],["IDL",2],["Racket",2],["Processing",2],["Cuda",2],["Gosu",2],["PogoScript",2],["Idris",2],["Red",1],["Nimrod",1],["OpenEdge ABL",1],["Perl6",1],["xBase",1],["Logos",1],["Factor",1],["Apex",1],["XC",1],["Coq",1],["Squirrel",1],["Game Maker Language",1],["Volt",1],["ColdFusion",1],["Monkey",1],["FLUX",1],["XQuery",1],["Bison",1],["Pure Data",1]],"countryCode3":"RUS","countryCode2":"RU","countryName":"Russia","hourlyWage":0},"RWA":{"2013":5,"2014":21,"fillKey":"JavaScript","allLangs":[["JavaScript",13],["Python",7],["PHP",6],["Java",5],["Ruby",3],["C#",2],["Objective-C",2],["CSS",2],["Shell",1],["Emacs Lisp",1]],"countryCode3":"RWA","countryCode2":"RW","countryName":"Rwanda","hourlyWage":2.52},"SAU":{"2013":45,"2014":87,"fillKey":"JavaScript","allLangs":[["JavaScript",33],["Python",28],["PHP",23],["CSS",18],["C#",11],["Java",11],["Ruby",10],["C",8],["C++",7],["Objective-C",6],["Shell",3],["VimL",3],["Swift",3],["Emacs Lisp",2],["R",2],["TeX",2],["Go",2],["Scala",2],["Lua",1],["Arduino",1],["FORTRAN",1],["D",1],["CoffeeScript",1],["Pascal",1]],"countryCode3":"SAU","countryCode2":"SA","countryName":"Saudi Arabia","hourlyWage":0},"SDN":{"2013":3,"2014":7,"fillKey":"Objective-C","allLangs":[["Objective-C",2],["JavaScript",2],["Haskell",1],["Pascal",1],["Frege",1],["Makefile",1],["CSS",1],["Java",1],["Python",1],["Go",1],["F#",1],["Scala",1],["CoffeeScript",1]],"countryCode3":"SDN","countryCode2":"SD","countryName":"Sudan","hourlyWage":2.12},"SWE":{"2013":2181,"2014":3198,"fillKey":"JavaScript","allLangs":[["JavaScript",1133],["Python",594],["Java",528],["CSS",511],["Shell",333],["PHP",332],["C",324],["C++",318],["Ruby",312],["C#",308],["Objective-C",181],["Go",153],["VimL",121],["CoffeeScript",106],["Scala",75],["Erlang",65],["Perl",61],["Emacs Lisp",58],["Swift",58],["Haskell",52],["TeX",49],["Lua",39],["Clojure",37],["Groovy",31],["PowerShell",29],["Matlab",29],["R",25],["OCaml",24],["XSLT",22],["Rust",22],["TypeScript",21],["Puppet",16],["Elixir",14],["Visual Basic",13],["Assembly",12],["Makefile",12],["F#",11],["Arduino",11],["AppleScript",10],["Julia",10],["D",9],["ActionScript",8],["Prolog",7],["Dart",6],["AGS Script",6],["Scheme",6],["Common Lisp",6],["M",5],["Vala",5],["Objective-C++",5],["Haxe",4],["Racket",4],["Processing",4],["Awk",4],["Nix",3],["ASP",3],["Kotlin",3],["FORTRAN",3],["AutoHotkey",3],["IDL",3],["VHDL",2],["Cuda",2],["MoonScript",2],["Elm",2],["Crystal",2],["DM",2],["Gosu",2],["Nimrod",2],["Verilog",2],["Ada",2],["Mercury",2],["Apex",2],["Grammatical Framework",2],["SQL",2],["OpenEdge ABL",1],["Agda",1],["Perl6",1],["BlitzBasic",1],["SystemVerilog",1],["PAWN",1],["XQuery",1],["LSL",1],["Max",1],["Standard ML",1],["Thrift",1],["Parrot",1],["Pure Data",1],["LabVIEW",1],["SQF",1],["Tcl",1],["ooc",1],["Gnuplot",1],["Ceylon",1],["Objective-J",1],["Forth",1],["Pascal",1],["Augeas",1],["PureScript",1],["LiveScript",1]],"countryCode3":"SWE","countryCode2":"SE","countryName":"Sweden","hourlyWage":13.24},"SGP":{"2013":585,"2014":1022,"fillKey":"JavaScript","allLangs":[["JavaScript",409],["Java",233],["CSS",217],["Python",205],["Ruby",155],["C++",133],["C",133],["PHP",120],["Objective-C",92],["Shell",92],["Go",65],["R",55],["CoffeeScript",53],["C#",53],["VimL",37],["Swift",33],["OCaml",22],["Scala",18],["Perl",18],["TeX",15],["Haskell",13],["Clojure",11],["Rust",10],["Emacs Lisp",9],["Erlang",7],["TypeScript",7],["Groovy",6],["Verilog",6],["Arduino",6],["Assembly",6],["PowerShell",6],["Lua",5],["Elixir",5],["ActionScript",4],["Cuda",4],["Julia",3],["Common Lisp",3],["Prolog",3],["VHDL",3],["Makefile",3],["Matlab",2],["Processing",2],["Dart",2],["AGS Script",2],["Objective-C++",2],["SourcePawn",2],["XSLT",2],["Nix",2],["Tcl",1],["AutoHotkey",1],["SQL",1],["Game Maker Language",1],["xBase",1],["LiveScript",1],["Nemerle",1],["OpenSCAD",1],["D",1],["Haxe",1],["Logos",1],["AppleScript",1],["Scheme",1],["Elm",1]],"countryCode3":"SGP","countryCode2":"SG","countryName":"Singapore","hourlyWage":8.94},"SVN":{"2013":200,"2014":302,"fillKey":"JavaScript","allLangs":[["JavaScript",113],["Python",68],["Java",63],["PHP",43],["CSS",41],["Shell",38],["C",31],["C++",28],["Ruby",27],["C#",18],["Objective-C",14],["Go",13],["VimL",9],["Scala",8],["R",8],["TeX",6],["Haskell",6],["Lua",5],["CoffeeScript",5],["Nix",5],["OCaml",4],["Perl",4],["Swift",4],["Matlab",4],["Groovy",3],["Arduino",2],["Standard ML",2],["Haxe",2],["Erlang",2],["Elm",2],["Assembly",1],["PureScript",1],["Emacs Lisp",1],["Gosu",1],["PowerShell",1],["Dart",1],["FORTRAN",1],["XSLT",1],["Mathematica",1],["Coq",1],["Scheme",1],["LiveScript",1],["ASP",1],["Puppet",1],["Clojure",1],["Rust",1],["F#",1],["Visual Basic",1]],"countryCode3":"SVN","countryCode2":"SI","countryName":"Slovenia","hourlyWage":12.44},"SVK":{"2013":223,"2014":333,"fillKey":"JavaScript","allLangs":[["JavaScript",114],["Python",63],["Java",62],["PHP",58],["CSS",58],["C++",44],["C",38],["Ruby",30],["C#",28],["Shell",25],["CoffeeScript",13],["VimL",9],["Go",8],["Objective-C",8],["Clojure",7],["TeX",6],["Lua",6],["Dart",5],["Perl",5],["Scala",4],["Rust",3],["Arduino",3],["R",3],["Swift",3],["PowerShell",3],["Emacs Lisp",2],["Haxe",2],["OpenEdge ABL",2],["Groovy",2],["Assembly",2],["TypeScript",2],["Pascal",2],["OCaml",2],["ActionScript",2],["XSLT",1],["Makefile",1],["AppleScript",1],["D",1],["Julia",1],["Objective-C++",1],["F#",1],["Matlab",1],["Visual Basic",1],["Haskell",1],["Vala",1],["ASP",1]],"countryCode3":"SVK","countryCode2":"SK","countryName":"Slovakia","hourlyWage":2.64},"SLE":{"2013":2,"2014":2,"fillKey":"Python","allLangs":[["Python",1],["C++",1],["Ruby",1],["Perl",1]],"countryCode3":"SLE","countryCode2":"SL","countryName":"Sierra Leone","hourlyWage":0},"SMR":{"2013":2,"2014":4,"fillKey":"CSS","allLangs":[["CSS",3],["PHP",2],["JavaScript",2],["AGS Script",1],["C",1],["Ruby",1],["C++",1],["Shell",1]],"countryCode3":"SMR","countryCode2":"SM","countryName":"San Marino","hourlyWage":0},"SEN":{"2013":11,"2014":14,"fillKey":"JavaScript","allLangs":[["JavaScript",5],["Python",4],["Objective-C",2],["C",2],["CSS",2],["C#",1],["Swift",1],["Assembly",1],["Emacs Lisp",1],["C++",1],["Java",1],["Shell",1],["PowerShell",1]],"countryCode3":"SEN","countryCode2":"SN","countryName":"Senegal","hourlyWage":8.18},"SOM":{"2013":2,"2014":5,"fillKey":"JavaScript","allLangs":[["JavaScript",5],["Java",2],["CSS",1]],"countryCode3":"SOM","countryCode2":"SO","countryName":"Somalia","hourlyWage":0},"SSD":{"2013":1,"2014":1,"fillKey":"Objective-C","allLangs":[["Objective-C",1],["Java",1]],"countryCode3":"SSD","countryCode2":"SS","countryName":"South Sudan"},"SLV":{"2013":54,"2014":87,"fillKey":"JavaScript","allLangs":[["JavaScript",43],["PHP",33],["CSS",25],["Java",17],["Ruby",9],["Python",7],["Shell",7],["C++",7],["Objective-C",6],["C",6],["Go",5],["VimL",4],["C#",3],["Scala",2],["Arduino",2],["Clojure",2],["Dart",2],["CoffeeScript",2],["OCaml",2],["Visual Basic",2],["Erlang",2],["VHDL",1],["Elm",1],["Perl",1],["TeX",1],["ASP",1],["Emacs Lisp",1],["Rust",1],["ActionScript",1],["TypeScript",1],["Elixir",1],["Haskell",1],["R",1],["Swift",1],["Nix",1],["Processing",1]],"countryCode3":"SLV","countryCode2":"SV","countryName":"El Salvador","hourlyWage":4.38},"SYR":{"2013":25,"2014":28,"fillKey":"JavaScript","allLangs":[["JavaScript",12],["PHP",7],["Ruby",6],["Java",5],["C#",4],["CSS",4],["C++",3],["C",3],["Python",2],["Shell",2],["VimL",2],["CoffeeScript",2],["Arduino",1],["Pascal",1],["R",1],["D",1],["Lua",1]],"countryCode3":"SYR","countryCode2":"SY","countryName":"Syrian Arab Republic","hourlyWage":0},"TCA":{"2013":2,"2014":2,"fillKey":"CSS","allLangs":[["CSS",2],["JavaScript",2],["Python",2],["PHP",1],["Objective-C",1]],"countryCode3":"TCA","countryCode2":"TC","countryName":"Turks And Caicos Islands","hourlyWage":0},"TCD":{"2013":1,"2014":1,"fillKey":"Shell","allLangs":[["Shell",1]],"countryCode3":"TCD","countryCode2":"TD","countryName":"Chad","hourlyWage":3.1},"ATF":{"2013":1,"2014":1,"fillKey":"Rust","allLangs":[["Rust",1]],"countryCode3":"ATF","countryCode2":"TF","countryName":"French Southern Territories","hourlyWage":0},"THA":{"2013":302,"2014":584,"fillKey":"JavaScript","allLangs":[["JavaScript",250],["CSS",128],["PHP",120],["Java",118],["Python",111],["Ruby",87],["C",66],["Objective-C",56],["C++",55],["Shell",53],["Go",35],["C#",32],["CoffeeScript",32],["VimL",28],["Swift",21],["OCaml",13],["Perl",11],["Arduino",10],["Emacs Lisp",6],["Visual Basic",6],["R",5],["Scala",5],["Elixir",5],["TeX",5],["Clojure",4],["Puppet",4],["Makefile",4],["AppleScript",4],["Lua",4],["Common Lisp",3],["Haskell",3],["Erlang",3],["ActionScript",2],["Objective-C++",2],["PowerShell",2],["Assembly",2],["Dart",2],["Prolog",2],["Rust",2],["Squirrel",1],["LiveScript",1],["Nimrod",1],["TypeScript",1],["Processing",1],["Crystal",1],["Haxe",1],["Logos",1],["AutoIt",1],["Groovy",1],["Vala",1],["Julia",1],["Matlab",1],["Pascal",1],["Frege",1],["XSLT",1]],"countryCode3":"THA","countryCode2":"TH","countryName":"Thailand","hourlyWage":3.3},"TJK":{"2013":4,"2014":14,"fillKey":"PHP","allLangs":[["PHP",5],["Java",4],["Python",3],["C",3],["JavaScript",3],["Ruby",2],["CSS",2],["C#",2],["C++",1],["Objective-C",1],["SQL",1],["D",1]],"countryCode3":"TJK","countryCode2":"TJ","countryName":"Tajikistan","hourlyWage":0},"TKM":{"2013":1,"2014":1,"fillKey":"Python","allLangs":[["Python",1],["Java",1]],"countryCode3":"TKM","countryCode2":"TM","countryName":"Turkmenistan"},"TUN":{"2013":89,"2014":124,"fillKey":"JavaScript","allLangs":[["JavaScript",54],["PHP",30],["Java",28],["Python",27],["CSS",25],["C",16],["C++",10],["Shell",7],["C#",6],["CoffeeScript",5],["Go",5],["Ruby",5],["VimL",4],["Perl",4],["OCaml",3],["Objective-C",3],["Clojure",2],["Scala",2],["Visual Basic",2],["Emacs Lisp",2],["TypeScript",1],["Common Lisp",1],["Groovy",1],["Makefile",1],["F#",1],["Haskell",1],["Matlab",1],["TeX",1],["ActionScript",1],["Scheme",1],["Haxe",1]],"countryCode3":"TUN","countryCode2":"TN","countryName":"Tunisia","hourlyWage":2.62},"TUR":{"2013":696,"2014":1150,"fillKey":"JavaScript","allLangs":[["JavaScript",482],["Java",285],["CSS",251],["PHP",232],["Python",229],["C",147],["C#",134],["C++",130],["Ruby",129],["Objective-C",122],["Shell",78],["CoffeeScript",58],["Go",57],["Swift",38],["VimL",29],["Scala",28],["PowerShell",19],["TeX",14],["OCaml",14],["TypeScript",14],["Perl",13],["Lua",13],["Clojure",13],["Haskell",9],["Matlab",9],["Rust",8],["Groovy",7],["Assembly",6],["R",6],["Arduino",6],["Visual Basic",6],["Erlang",6],["ActionScript",5],["Emacs Lisp",5],["Elixir",4],["AppleScript",3],["Logos",3],["Crystal",3],["Puppet",3],["Dart",3],["Vala",3],["ASP",3],["IDL",2],["Julia",2],["Makefile",2],["Processing",2],["F#",2],["AGS Script",2],["LiveScript",2],["Pascal",2],["M",2],["Objective-C++",2],["Xtend",1],["Nix",1],["Propeller Spin",1],["Game Maker Language",1],["Squirrel",1],["D",1],["Scheme",1],["Gnuplot",1],["Hy",1],["Common Lisp",1],["Prolog",1],["FORTRAN",1],["Ragel in Ruby Host",1],["Hack",1],["Cuda",1]],"countryCode3":"TUR","countryCode2":"TR","countryName":"Turkey","hourlyWage":0},"TTO":{"2013":9,"2014":16,"fillKey":"JavaScript","allLangs":[["JavaScript",8],["Python",5],["Java",4],["CSS",4],["Ruby",3],["C",2],["CoffeeScript",1],["Matlab",1],["TeX",1],["PHP",1],["C++",1],["Julia",1],["Shell",1]],"countryCode3":"TTO","countryCode2":"TT","countryName":"Trinidad And Tobago","hourlyWage":11.94},"TUV":{"2013":1,"2014":1,"fillKey":"PHP","allLangs":[["PHP",1]],"countryCode3":"TUV","countryCode2":"TV","countryName":"Tuvalu"},"TWN":{"2013":1039,"2014":1677,"fillKey":"JavaScript","allLangs":[["JavaScript",737],["Python",394],["CSS",389],["Java",293],["C++",273],["C",246],["Ruby",230],["Shell",222],["PHP",209],["Objective-C",179],["Go",111],["C#",109],["VimL",107],["CoffeeScript",80],["Swift",56],["LiveScript",31],["TeX",29],["Perl",28],["OCaml",28],["Scala",25],["R",24],["Emacs Lisp",23],["Groovy",20],["Visual Basic",15],["Lua",12],["Matlab",11],["PowerShell",10],["Clojure",9],["Rust",8],["ActionScript",7],["Erlang",7],["TypeScript",7],["XSLT",7],["Haskell",5],["Assembly",5],["Arduino",5],["Objective-C++",4],["Makefile",4],["Dart",4],["Processing",4],["Elixir",4],["ASP",3],["Scheme",3],["Pascal",3],["D",2],["FORTRAN",2],["Vala",2],["AutoIt",2],["Crystal",2],["Puppet",2],["Julia",2],["Logos",2],["Verilog",2],["Prolog",2],["OpenEdge ABL",1],["IDL",1],["MoonScript",1],["BlitzBasic",1],["Nix",1],["OpenSCAD",1],["Standard ML",1],["AGS Script",1],["Awk",1],["NetLogo",1],["Haxe",1],["Kotlin",1],["Common Lisp",1],["Bison",1],["Nimrod",1]],"countryCode3":"TWN","countryCode2":"TW","countryName":"Taiwan, Province Of China","hourlyWage":12.88},"TZA":{"2013":17,"2014":36,"fillKey":"JavaScript","allLangs":[["JavaScript",11],["PHP",11],["Java",9],["CSS",9],["CoffeeScript",4],["Go",3],["Ruby",3],["Python",3],["Shell",1],["C++",1],["Common Lisp",1],["Clojure",1],["Scala",1]],"countryCode3":"TZA","countryCode2":"TZ","countryName":"Tanzania, United Republic Of","hourlyWage":0},"UKR":{"2013":2253,"2014":3325,"fillKey":"JavaScript","allLangs":[["JavaScript",1294],["Java",597],["CSS",583],["PHP",576],["Python",483],["Ruby",447],["C++",301],["C",294],["Shell",230],["C#",214],["Objective-C",183],["CoffeeScript",124],["Go",97],["VimL",77],["Swift",51],["Scala",45],["Perl",42],["Clojure",38],["OCaml",36],["Erlang",32],["Groovy",29],["Haskell",28],["Rust",28],["Lua",24],["Emacs Lisp",22],["PowerShell",16],["TeX",15],["Pascal",13],["R",13],["TypeScript",12],["ActionScript",11],["Puppet",9],["Elixir",9],["Assembly",9],["Objective-C++",7],["Haxe",7],["Prolog",6],["F#",6],["Dart",6],["Makefile",5],["Vala",5],["Visual Basic",5],["AGS Script",5],["Racket",4],["Common Lisp",4],["D",4],["XSLT",4],["LiveScript",4],["Arduino",3],["Kotlin",3],["Matlab",3],["DM",3],["Nix",2],["Frege",2],["Processing",2],["Scheme",2],["Crystal",2],["Game Maker Language",1],["Julia",1],["Nimrod",1],["Zephir",1],["Elm",1],["OpenEdge ABL",1],["FORTRAN",1],["Apex",1],["Grammatical Framework",1],["AutoHotkey",1],["Logos",1],["SQL",1],["Max",1],["XC",1],["Eiffel",1],["Perl6",1],["ASP",1],["Smalltalk",1],["Coq",1],["Mathematica",1],["AppleScript",1],["BlitzBasic",1],["Standard ML",1],["VCL",1],["Cycript",1],["Nemerle",1],["Forth",1],["Gosu",1],["PureScript",1],["Io",1],["SQF",1],["wisp",1]],"countryCode3":"UKR","countryCode2":"UA","countryName":"Ukraine","hourlyWage":0},"UGA":{"2013":33,"2014":58,"fillKey":"JavaScript","allLangs":[["JavaScript",27],["Python",19],["CSS",17],["Java",10],["Ruby",10],["C#",8],["PHP",6],["C",5],["C++",3],["Erlang",3],["Clojure",1],["Go",1],["VimL",1],["Emacs Lisp",1],["Apex",1],["CoffeeScript",1],["Haskell",1],["PowerShell",1],["Perl",1],["Shell",1]],"countryCode3":"UGA","countryCode2":"UG","countryName":"Uganda","hourlyWage":1.24},"USA":{"2013":47736,"2014":74250,"fillKey":"JavaScript","allLangs":[["JavaScript",30791],["CSS",16438],["Python",16054],["Ruby",13563],["Java",11063],["Shell",7474],["C++",7386],["C",7355],["PHP",7193],["Objective-C",5244],["Go",4254],["C#",4095],["CoffeeScript",3036],["VimL",2882],["Swift",1632],["Scala",1573],["R",1570],["Perl",1436],["Clojure",1081],["TeX",1060],["Emacs Lisp",1038],["OCaml",898],["Haskell",760],["Rust",611],["Lua",562],["Groovy",465],["Puppet",428],["Matlab",426],["Arduino",422],["PowerShell",397],["TypeScript",395],["Erlang",335],["Elixir",311],["Assembly",266],["XSLT",262],["Visual Basic",233],["Processing",214],["Julia",213],["Makefile",197],["Scheme",175],["ActionScript",157],["Common Lisp",135],["FORTRAN",132],["Haxe",121],["D",120],["Racket",117],["Prolog",114],["F#",112],["AppleScript",108],["Dart",108],["Objective-C++",106],["AGS Script",92],["ASP",82],["Verilog",68],["Nix",60],["Crystal",60],["Cuda",57],["ColdFusion",56],["Apex",52],["OpenEdge ABL",49],["OpenSCAD",48],["Vala",46],["IDL",45],["LiveScript",44],["Pascal",44],["PureScript",41],["Elm",39],["Max",39],["Tcl",39],["VHDL",38],["Kotlin",35],["Gosu",34],["Logos",34],["Mathematica",33],["Standard ML",33],["SQF",30],["Coq",29],["Game Maker Language",27],["AutoHotkey",25],["Nemerle",23],["M",21],["Awk",20],["Thrift",20],["XQuery",20],["Squirrel",19],["SAS",19],["Nimrod",19],["Pure Data",17],["nesC",17],["Stata",16],["SQL",16],["VCL",16],["Propeller Spin",15],["Mercury",14],["SourcePawn",14],["GAP",14],["BlitzBasic",13],["LabVIEW",13],["Perl6",13],["Red",13],["Gnuplot",12],["Frege",12],["J",12],["SuperCollider",11],["MoonScript",10],["Objective-J",10],["SystemVerilog",9],["DM",9],["Agda",9],["DOT",9],["NetLogo",9],["Ada",8],["Eiffel",8],["Arc",8],["ANTLR",8],["Io",8],["AutoIt",7],["Factor",7],["Bluespec",6],["wisp",6],["REALbasic",6],["Delphi",6],["UnrealScript",5],["Hack",5],["Rebol",5],["Brightscript",5],["COBOL",5],["Bro",5],["Lasso",5],["AspectJ",4],["ATS",4],["Inform 7",4],["Scilab",4],["Boo",4],["Smalltalk",4],["Idris",4],["Dylan",3],["LSL",3],["Slash",3],["Cycript",3],["Fantom",3],["Augeas",3],["Grammatical Framework",3],["Hy",2],["JSONiq",2],["Forth",2],["Ragel in Ruby Host",2],["Glyph",2],["Bison",2],["Papyrus",2],["EmberScript",1],["Monkey",1],["Xojo",1],["ooc",1],["PAWN",1],["Self",1],["Ceylon",1],["Logtalk",1],["Ecl",1],["XC",1],["Nu",1],["Parrot",1],["Xtend",1],["APL",1],["GDScript",1],["PogoScript",1],["Isabelle",1],["Fancy",1],["XProc",1],["GAMS",1],["Grace",1],["Chapel",1],["LOLCODE",1],["Mirah",1],["XML",1],["Zephir",1],["Harbour",1],["ABAP",1],["Turing",1],["Opal",1],["PigLatin",1],["CLIPS",1],["KRL",1],["LookML",1]],"countryCode3":"USA","countryCode2":"US","countryName":"United States","hourlyWage":28.68},"URY":{"2013":184,"2014":270,"fillKey":"JavaScript","allLangs":[["JavaScript",90],["Ruby",52],["Java",52],["Python",43],["CSS",42],["PHP",38],["Shell",20],["C",18],["C#",13],["Go",12],["Objective-C",12],["Scala",9],["CoffeeScript",8],["VimL",8],["Lua",7],["C++",4],["Emacs Lisp",4],["Groovy",4],["Arduino",2],["TeX",2],["Clojure",2],["PowerShell",2],["Kotlin",2],["R",2],["Haskell",1],["Makefile",1],["Rust",1],["Augeas",1],["TypeScript",1],["Gosu",1],["Perl",1],["Swift",1],["Matlab",1],["Puppet",1],["Common Lisp",1]],"countryCode3":"URY","countryCode2":"UY","countryName":"Uruguay","hourlyWage":0},"UZB":{"2013":23,"2014":43,"fillKey":"JavaScript","allLangs":[["JavaScript",21],["PHP",10],["Java",8],["CSS",7],["Ruby",6],["Python",6],["C#",5],["C",4],["Shell",4],["Objective-C",3],["Scala",2],["TypeScript",1],["C++",1],["Groovy",1],["Perl",1],["Elixir",1],["Kotlin",1],["VimL",1],["CoffeeScript",1],["Go",1],["Rust",1]],"countryCode3":"UZB","countryCode2":"UZ","countryName":"Uzbekistan","hourlyWage":0},"VCT":{"2013":2,"2014":1,"fillKey":"JavaScript","allLangs":[["JavaScript",1]],"countryCode3":"VCT","countryCode2":"VC","countryName":"Saint Vincent And The Grenadines","hourlyWage":11.84},"VEN":{"2013":199,"2014":344,"fillKey":"JavaScript","allLangs":[["JavaScript",151],["PHP",80],["CSS",74],["Java",54],["Python",52],["Ruby",37],["Shell",24],["C++",19],["C",16],["C#",16],["Objective-C",10],["Go",9],["CoffeeScript",6],["Perl",5],["VimL",5],["R",5],["Lua",3],["Scala",3],["Haskell",3],["Clojure",2],["Emacs Lisp",2],["Swift",2],["Puppet",2],["Assembly",1],["Verilog",1],["Kotlin",1],["Arduino",1],["TeX",1],["XSLT",1],["Elixir",1],["Matlab",1],["Standard ML",1],["Crystal",1],["Groovy",1],["ASP",1],["TypeScript",1],["Visual Basic",1],["Makefile",1]],"countryCode3":"VEN","countryCode2":"VE","countryName":"Venezuela, Bolivarian Republic Of","hourlyWage":14.14},"VIR":{"2013":2,"2014":1,"fillKey":"PHP","allLangs":[["PHP",1],["JavaScript",1]],"countryCode3":"VIR","countryCode2":"VI","countryName":"Virgin Islands (US)","hourlyWage":22.62},"VNM":{"2013":11,"2014":11,"fillKey":"CSS","allLangs":[["CSS",4],["PHP",4],["JavaScript",3],["Shell",2],["Python",2],["Ruby",1],["Java",1],["C++",1]],"countryCode3":"VNM","countryCode2":"XK","countryName":"Viet Nam","hourlyWage":0},"YEM":{"2013":4,"2014":5,"fillKey":"JavaScript","allLangs":[["JavaScript",3],["CSS",2],["PHP",2],["Java",1],["C#",1],["OCaml",1],["C",1],["Objective-C",1]],"countryCode3":"YEM","countryCode2":"YE","countryName":"Yemen","hourlyWage":0},"MYT":{"2013":1,"2014":1,"fillKey":"PHP","allLangs":[["PHP",1]],"countryCode3":"MYT","countryCode2":"YT","countryName":"Mayotte","hourlyWage":0},"ZAF":{"2013":574,"2014":851,"fillKey":"JavaScript","allLangs":[["JavaScript",354],["Python",189],["CSS",160],["Java",145],["PHP",110],["Ruby",104],["C#",82],["C++",75],["C",71],["Shell",60],["Go",36],["Objective-C",33],["CoffeeScript",29],["VimL",20],["R",15],["TeX",13],["Perl",12],["Scala",12],["Clojure",10],["Swift",9],["Lua",8],["Haskell",8],["TypeScript",8],["Groovy",7],["Visual Basic",6],["OCaml",6],["Emacs Lisp",5],["Rust",5],["Puppet",4],["Erlang",4],["Nix",4],["F#",3],["Haxe",3],["Vala",3],["XSLT",3],["Arduino",3],["Assembly",3],["Common Lisp",3],["Pascal",2],["Dart",2],["Processing",2],["Scheme",2],["Elixir",2],["LiveScript",2],["Xtend",2],["Objective-C++",2],["Elm",2],["Makefile",2],["Logos",1],["ATS",1],["Nemerle",1],["Objective-J",1],["Kotlin",1],["Mathematica",1],["Pure Data",1],["FORTRAN",1],["ActionScript",1],["AutoHotkey",1],["Nimrod",1],["Clean",1],["D",1],["Prolog",1],["Verilog",1],["Matlab",1],["PowerShell",1],["PureScript",1],["XQuery",1],["AppleScript",1],["AutoIt",1]],"countryCode3":"ZAF","countryCode2":"ZA","countryName":"South Africa","hourlyWage":0},"ZMB":{"2013":3,"2014":5,"fillKey":"Ruby","allLangs":[["Ruby",3],["JavaScript",2],["CSS",1],["PHP",1],["Java",1],["Shell",1],["Python",1]],"countryCode3":"ZMB","countryCode2":"ZM","countryName":"Zambia","hourlyWage":1.313012},"ZWE":{"2013":5,"2014":13,"fillKey":"Python","allLangs":[["Python",4],["JavaScript",3],["Shell",2],["Java",2],["C++",2],["C",1],["CoffeeScript",1],["C#",1],["Objective-C",1],["Ruby",1],["PHP",1]],"countryCode3":"ZWE","countryCode2":"ZW","countryName":"Zimbabwe","hourlyWage":4.52766}};
var developersByCountryData = {"ATG":{"programmers2013":1,"programmers2014":3,"hourlyWage":3.91,"countryCode2":"AG","countryCode3":"ATG","countryName":"Antigua And Barbuda"},"AGO":{"programmers2013":3,"programmers2014":9,"hourlyWage":0.92,"countryCode2":"AO","countryCode3":"AGO","countryName":"Angola"},"ARG":{"programmers2013":1071,"programmers2014":1598,"hourlyWage":0.78,"countryCode2":"AR","countryCode3":"ARG","countryName":"Argentina"},"AUT":{"programmers2013":937,"programmers2014":1373,"hourlyWage":7.95,"countryCode2":"AT","countryCode3":"AUT","countryName":"Austria"},"AUS":{"programmers2013":3319,"programmers2014":4803,"hourlyWage":12.5,"countryCode2":"AU","countryCode3":"AUS","countryName":"Australia"},"BRB":{"programmers2013":3,"programmers2014":2,"hourlyWage":6.51,"countryCode2":"BB","countryCode3":"BRB","countryName":"Barbados"},"BGD":{"programmers2013":216,"programmers2014":499,"hourlyWage":0.65,"countryCode2":"BD","countryCode3":"BGD","countryName":"Bangladesh"},"BFA":{"programmers2013":2,"programmers2014":3,"hourlyWage":1.08,"countryCode2":"BF","countryCode3":"BFA","countryName":"Burkina Faso"},"BGR":{"programmers2013":474,"programmers2014":868,"hourlyWage":1.01,"countryCode2":"BG","countryCode3":"BGR","countryName":"Bulgaria"},"BHR":{"programmers2013":11,"programmers2014":14,"hourlyWage":5.52,"countryCode2":"BH","countryCode3":"BHR","countryName":"Bahrain"},"BEN":{"programmers2013":39,"programmers2014":73,"hourlyWage":1.76,"countryCode2":"BJ","countryCode3":"BEN","countryName":"Benin"},"BOL":{"programmers2013":51,"programmers2014":85,"hourlyWage":1.18,"countryCode2":"BO","countryCode3":"BOL","countryName":"Bolivia, Plurinational State Of"},"BRA":{"programmers2013":2797,"programmers2014":4441,"hourlyWage":3.18,"countryCode2":"BR","countryCode3":"BRA","countryName":"Brazil"},"BHS":{"programmers2013":1,"programmers2014":2,"hourlyWage":8,"countryCode2":"BS","countryCode3":"BHS","countryName":"Bahamas"},"CAN":{"programmers2013":5396,"programmers2014":8448,"hourlyWage":10.94,"countryCode2":"CA","countryCode3":"CAN","countryName":"Canada"},"CIV":{"programmers2013":4,"programmers2014":1,"hourlyWage":0.98,"countryCode2":"CI","countryCode3":"CIV","countryName":"Cote d'Ivoire"},"CHL":{"programmers2013":383,"programmers2014":607,"hourlyWage":5.49,"countryCode2":"CL","countryCode3":"CHL","countryName":"Chile"},"COL":{"programmers2013":342,"programmers2014":566,"hourlyWage":1.74,"countryCode2":"CO","countryCode3":"COL","countryName":"Colombia"},"CRI":{"programmers2013":139,"programmers2014":248,"hourlyWage":3.85,"countryCode2":"CR","countryCode3":"CRI","countryName":"Costa Rica"},"CYP":{"programmers2013":44,"programmers2014":83,"hourlyWage":3.18,"countryCode2":"CY","countryCode3":"CYP","countryName":"Cyprus"},"CZE":{"programmers2013":952,"programmers2014":1424,"hourlyWage":1.5,"countryCode2":"CZ","countryCode3":"CZE","countryName":"Czech Republic"},"DEU":{"programmers2013":8299,"programmers2014":12612,"hourlyWage":8.25,"countryCode2":"DE","countryCode3":"DEU","countryName":"Germany"},"DNK":{"programmers2013":1220,"programmers2014":1699,"hourlyWage":8.79,"countryCode2":"DK","countryCode3":"DNK","countryName":"Denmark"},"DOM":{"programmers2013":70,"programmers2014":126,"hourlyWage":0.91,"countryCode2":"DO","countryCode3":"DOM","countryName":"Dominican Republic"},"DZA":{"programmers2013":36,"programmers2014":62,"hourlyWage":3.52,"countryCode2":"DZ","countryCode3":"DZA","countryName":"Algeria"},"EGY":{"programmers2013":189,"programmers2014":334,"hourlyWage":0.97,"countryCode2":"EG","countryCode3":"EGY","countryName":"Egypt"},"ERI":{"programmers2013":103,"programmers2014":200,"hourlyWage":1.2,"countryCode2":"ER","countryCode3":"ERI","countryName":"Eritrea"},"FIN":{"programmers2013":941,"programmers2014":1443,"hourlyWage":7.26,"countryCode2":"FI","countryCode3":"FIN","countryName":"Finland"},"FJI":{"programmers2013":1,"programmers2014":1,"hourlyWage":6.07,"countryCode2":"FJ","countryCode3":"FJI","countryName":"Fiji"},"GBR":{"programmers2013":8877,"programmers2014":13400,"hourlyWage":24.33,"countryCode2":"GB","countryCode3":"GBR","countryName":"United Kingdom"},"GRD":{"programmers2013":2,"programmers2014":9,"hourlyWage":2.67,"countryCode2":"GD","countryCode3":"GRD","countryName":"Grenada"},"GHA":{"programmers2013":51,"programmers2014":76,"hourlyWage":2.45,"countryCode2":"GH","countryCode3":"GHA","countryName":"Ghana"},"GLP":{"programmers2013":4,"programmers2014":5,"hourlyWage":7.39,"countryCode2":"GP","countryCode3":"GLP","countryName":"Guadeloupe"},"GTM":{"programmers2013":61,"programmers2014":108,"hourlyWage":2.51,"countryCode2":"GT","countryCode3":"GTM","countryName":"Guatemala"},"HKG":{"programmers2013":331,"programmers2014":556,"hourlyWage":5.36,"countryCode2":"HK","countryCode3":"HKG","countryName":"Hong Kong"},"HND":{"programmers2013":41,"programmers2014":46,"hourlyWage":2.52,"countryCode2":"HN","countryCode3":"HND","countryName":"Honduras"},"HRV":{"programmers2013":254,"programmers2014":370,"hourlyWage":3.84,"countryCode2":"HR","countryCode3":"HRV","countryName":"Croatia"},"HUN":{"programmers2013":513,"programmers2014":786,"hourlyWage":3.23,"countryCode2":"HU","countryCode3":"HUN","countryName":"Hungary"},"IMN":{"programmers2013":5,"programmers2014":6,"hourlyWage":4.8,"countryCode2":"IM","countryCode3":"IMN","countryName":"Isle Of Man"},"IND":{"programmers2013":4494,"programmers2014":8134,"hourlyWage":1.19,"countryCode2":"IN","countryCode3":"IND","countryName":"India"},"ITA":{"programmers2013":1965,"programmers2014":2975,"hourlyWage":4.76,"countryCode2":"IT","countryCode3":"ITA","countryName":"Italy"},"JOR":{"programmers2013":41,"programmers2014":79,"hourlyWage":1.93,"countryCode2":"JO","countryCode3":"JOR","countryName":"Jordan"},"JPN":{"programmers2013":4266,"programmers2014":5923,"hourlyWage":4.59,"countryCode2":"JP","countryCode3":"JPN","countryName":"Japan"},"KEN":{"programmers2013":122,"programmers2014":230,"hourlyWage":4.65,"countryCode2":"KE","countryCode3":"KEN","countryName":"Kenya"},"COM":{"programmers2013":1,"programmers2014":1,"hourlyWage":0.67,"countryCode2":"KM","countryCode3":"COM","countryName":"Comoros"},"KOR":{"programmers2013":1007,"programmers2014":1559,"hourlyWage":2.26,"countryCode2":"KR","countryCode3":"KOR","countryName":"Korea, Republic Of"},"KWT":{"programmers2013":15,"programmers2014":28,"hourlyWage":6.71,"countryCode2":"KW","countryCode3":"KWT","countryName":"Kuwait"},"KAZ":{"programmers2013":68,"programmers2014":141,"hourlyWage":1.4,"countryCode2":"KZ","countryCode3":"KAZ","countryName":"Kazakhstan"},"LCA":{"programmers2013":1,"programmers2014":2,"hourlyWage":5.77,"countryCode2":"LC","countryCode3":"LCA","countryName":"Saint Lucia"},"LTU":{"programmers2013":227,"programmers2014":366,"hourlyWage":1.09,"countryCode2":"LT","countryCode3":"LTU","countryName":"Lithuania"},"LUX":{"programmers2013":74,"programmers2014":136,"hourlyWage":27.94,"countryCode2":"LU","countryCode3":"LUX","countryName":"Luxembourg"},"LVA":{"programmers2013":204,"programmers2014":263,"hourlyWage":1.54,"countryCode2":"LV","countryCode3":"LVA","countryName":"Latvia"},"MDA":{"programmers2013":79,"programmers2014":120,"hourlyWage":0.43,"countryCode2":"MD","countryCode3":"MDA","countryName":"Moldova"},"MDG":{"programmers2013":11,"programmers2014":24,"hourlyWage":0.35,"countryCode2":"MG","countryCode3":"MDG","countryName":"Madagascar"},"MMR":{"programmers2013":31,"programmers2014":51,"hourlyWage":1.08,"countryCode2":"MM","countryCode3":"MMR","countryName":"Myanmar"},"MWI":{"programmers2013":7,"programmers2014":8,"hourlyWage":2.93,"countryCode2":"MW","countryCode3":"MWI","countryName":"Malawi"},"MEX":{"programmers2013":679,"programmers2014":980,"hourlyWage":3.5,"countryCode2":"MX","countryCode3":"MEX","countryName":"Mexico"},"MOZ":{"programmers2013":2,"programmers2014":5,"hourlyWage":0.47,"countryCode2":"MZ","countryCode3":"MOZ","countryName":"Mozambique"},"NAM":{"programmers2013":6,"programmers2014":16,"hourlyWage":8.59,"countryCode2":"NA","countryCode3":"NAM","countryName":"Namibia"},"NGA":{"programmers2013":60,"programmers2014":152,"hourlyWage":3.12,"countryCode2":"NG","countryCode3":"NGA","countryName":"Nigeria"},"NIC":{"programmers2013":28,"programmers2014":53,"hourlyWage":3.41,"countryCode2":"NI","countryCode3":"NIC","countryName":"Nicaragua"},"NZL":{"programmers2013":861,"programmers2014":1344,"hourlyWage":5.49,"countryCode2":"NZ","countryCode3":"NZL","countryName":"New Zealand"},"PER":{"programmers2013":133,"programmers2014":171,"hourlyWage":0.56,"countryCode2":"PE","countryCode3":"PER","countryName":"Peru"},"PYF":{"programmers2013":4,"programmers2014":4,"hourlyWage":13.38,"countryCode2":"PF","countryCode3":"PYF","countryName":"French Polynesia"},"PNG":{"programmers2013":1,"programmers2014":1,"hourlyWage":2.85,"countryCode2":"PG","countryCode3":"PNG","countryName":"Papua New Guinea"},"PHL":{"programmers2013":486,"programmers2014":740,"hourlyWage":1.84,"countryCode2":"PH","countryCode3":"PHL","countryName":"Philippines"},"PAK":{"programmers2013":208,"programmers2014":379,"hourlyWage":0.88,"countryCode2":"PK","countryCode3":"PAK","countryName":"Pakistan"},"POL":{"programmers2013":1526,"programmers2014":2429,"hourlyWage":3.09,"countryCode2":"PL","countryCode3":"POL","countryName":"Poland"},"PRI":{"programmers2013":59,"programmers2014":84,"hourlyWage":9.11,"countryCode2":"PR","countryCode3":"PRI","countryName":"Puerto Rico"},"PRT":{"programmers2013":795,"programmers2014":1255,"hourlyWage":9.49,"countryCode2":"PT","countryCode3":"PRT","countryName":"Portugal"},"ROU":{"programmers2013":622,"programmers2014":898,"hourlyWage":1.08,"countryCode2":"RO","countryCode3":"ROU","countryName":"Romania"},"RWA":{"programmers2013":5,"programmers2014":21,"hourlyWage":1.26,"countryCode2":"RW","countryCode3":"RWA","countryName":"Rwanda"},"SDN":{"programmers2013":3,"programmers2014":7,"hourlyWage":1.06,"countryCode2":"SD","countryCode3":"SDN","countryName":"Sudan"},"SWE":{"programmers2013":2181,"programmers2014":3198,"hourlyWage":6.62,"countryCode2":"SE","countryCode3":"SWE","countryName":"Sweden"},"SGP":{"programmers2013":585,"programmers2014":1022,"hourlyWage":4.47,"countryCode2":"SG","countryCode3":"SGP","countryName":"Singapore"},"SVN":{"programmers2013":200,"programmers2014":302,"hourlyWage":6.22,"countryCode2":"SI","countryCode3":"SVN","countryName":"Slovenia"},"SVK":{"programmers2013":223,"programmers2014":333,"hourlyWage":1.32,"countryCode2":"SK","countryCode3":"SVK","countryName":"Slovakia"},"SEN":{"programmers2013":11,"programmers2014":14,"hourlyWage":4.09,"countryCode2":"SN","countryCode3":"SEN","countryName":"Senegal"},"SLV":{"programmers2013":54,"programmers2014":87,"hourlyWage":2.19,"countryCode2":"SV","countryCode3":"SLV","countryName":"El Salvador"},"TCD":{"programmers2013":1,"programmers2014":1,"hourlyWage":1.55,"countryCode2":"TD","countryCode3":"TCD","countryName":"Chad"},"THA":{"programmers2013":302,"programmers2014":584,"hourlyWage":1.65,"countryCode2":"TH","countryCode3":"THA","countryName":"Thailand"},"TUN":{"programmers2013":89,"programmers2014":124,"hourlyWage":1.31,"countryCode2":"TN","countryCode3":"TUN","countryName":"Tunisia"},"TTO":{"programmers2013":9,"programmers2014":16,"hourlyWage":5.97,"countryCode2":"TT","countryCode3":"TTO","countryName":"Trinidad And Tobago"},"TWN":{"programmers2013":1039,"programmers2014":1677,"hourlyWage":6.44,"countryCode2":"TW","countryCode3":"TWN","countryName":"Taiwan, Province Of China"},"UGA":{"programmers2013":33,"programmers2014":58,"hourlyWage":0.62,"countryCode2":"UG","countryCode3":"UGA","countryName":"Uganda"},"USA":{"programmers2013":47736,"programmers2014":74250,"hourlyWage":14.34,"countryCode2":"US","countryCode3":"USA","countryName":"United States"},"VCT":{"programmers2013":2,"programmers2014":1,"hourlyWage":5.92,"countryCode2":"VC","countryCode3":"VCT","countryName":"Saint Vincent And The Grenadines"},"VEN":{"programmers2013":199,"programmers2014":344,"hourlyWage":7.07,"countryCode2":"VE","countryCode3":"VEN","countryName":"Venezuela, Bolivarian Republic Of"},"VIR":{"programmers2013":2,"programmers2014":1,"hourlyWage":11.31,"countryCode2":"VI","countryCode3":"VIR","countryName":"Virgin Islands (US)"},"ZMB":{"programmers2013":3,"programmers2014":5,"hourlyWage":0.656506,"countryCode2":"ZM","countryCode3":"ZMB","countryName":"Zambia"},"ZWE":{"programmers2013":5,"programmers2014":13,"hourlyWage":2.26383,"countryCode2":"ZW","countryCode3":"ZWE","countryName":"Zimbabwe"}};
var developersByLanguage = [{"language":"JavaScript","activeProgrammers":224050},{"language":"Java","activeProgrammers":139127},{"language":"Python","activeProgrammers":116128},{"language":"CSS","activeProgrammers":113774},{"language":"PHP","activeProgrammers":80705},{"language":"C++","activeProgrammers":70489},{"language":"Ruby","activeProgrammers":70029},{"language":"C","activeProgrammers":67456},{"language":"Shell","activeProgrammers":45709},{"language":"C#","activeProgrammers":44479},{"language":"Objective-C","activeProgrammers":37411},{"language":"Go","activeProgrammers":22434},{"language":"CoffeeScript","activeProgrammers":16843},{"language":"VimL","activeProgrammers":15904},{"language":"R","activeProgrammers":12313},{"language":"Scala","activeProgrammers":10446},{"language":"Swift","activeProgrammers":9763},{"language":"TeX","activeProgrammers":9233},{"language":"Perl","activeProgrammers":9091},{"language":"Lua","activeProgrammers":5853},{"language":"Emacs Lisp","activeProgrammers":5601},{"language":"Clojure","activeProgrammers":4742},{"language":"Haskell","activeProgrammers":4433},{"language":"OCaml","activeProgrammers":4304},{"language":"Matlab","activeProgrammers":4007},{"language":"Groovy","activeProgrammers":3868},{"language":"TypeScript","activeProgrammers":3693},{"language":"Arduino","activeProgrammers":3023},{"language":"Rust","activeProgrammers":2851},{"language":"PowerShell","activeProgrammers":2768},{"language":"Erlang","activeProgrammers":2396},{"language":"Puppet","activeProgrammers":2246},{"language":"XSLT","activeProgrammers":1994},{"language":"Assembly","activeProgrammers":1895},{"language":"ActionScript","activeProgrammers":1858},{"language":"Visual Basic","activeProgrammers":1794},{"language":"Processing","activeProgrammers":1413},{"language":"Makefile","activeProgrammers":1397},{"language":"Elixir","activeProgrammers":1231},{"language":"ASP","activeProgrammers":1164},{"language":"D","activeProgrammers":1101},{"language":"Julia","activeProgrammers":1026},{"language":"Scheme","activeProgrammers":1006},{"language":"Haxe","activeProgrammers":983},{"language":"Objective-C++","activeProgrammers":934},{"language":"Prolog","activeProgrammers":896},{"language":"F#","activeProgrammers":888},{"language":"Common Lisp","activeProgrammers":861},{"language":"Dart","activeProgrammers":766},{"language":"Pascal","activeProgrammers":753},{"language":"FORTRAN","activeProgrammers":749},{"language":"AGS Script","activeProgrammers":638},{"language":"Stata","activeProgrammers":559},{"language":"Racket","activeProgrammers":512},{"language":"Verilog","activeProgrammers":500},{"language":"VHDL","activeProgrammers":495},{"language":"Vala","activeProgrammers":471},{"language":"AppleScript","activeProgrammers":430},{"language":"Kotlin","activeProgrammers":425},{"language":"DM","activeProgrammers":381},{"language":"Mathematica","activeProgrammers":344},{"language":"SQF","activeProgrammers":338},{"language":"Cuda","activeProgrammers":332},{"language":"IDL","activeProgrammers":318},{"language":"Logos","activeProgrammers":305},{"language":"Nix","activeProgrammers":295},{"language":"OpenSCAD","activeProgrammers":289},{"language":"Tcl","activeProgrammers":274},{"language":"Crystal","activeProgrammers":273},{"language":"AutoHotkey","activeProgrammers":261},{"language":"Game Maker Language","activeProgrammers":258},{"language":"Apex","activeProgrammers":254},{"language":"LiveScript","activeProgrammers":252},{"language":"Standard ML","activeProgrammers":233},{"language":"OpenEdge ABL","activeProgrammers":228},{"language":"ColdFusion","activeProgrammers":218},{"language":"M","activeProgrammers":216},{"language":"Gosu","activeProgrammers":194},{"language":"Elm","activeProgrammers":194},{"language":"BlitzBasic","activeProgrammers":188},{"language":"Max","activeProgrammers":177},{"language":"SourcePawn","activeProgrammers":150},{"language":"PureScript","activeProgrammers":147},{"language":"Coq","activeProgrammers":138},{"language":"Nemerle","activeProgrammers":130},{"language":"Mercury","activeProgrammers":125},{"language":"nesC","activeProgrammers":121},{"language":"SQL","activeProgrammers":111},{"language":"Pure Data","activeProgrammers":108},{"language":"Nimrod","activeProgrammers":105},{"language":"XQuery","activeProgrammers":105},{"language":"Awk","activeProgrammers":99},{"language":"AutoIt","activeProgrammers":97},{"language":"VCL","activeProgrammers":92},{"language":"Xtend","activeProgrammers":89},{"language":"GAP","activeProgrammers":82},{"language":"LabVIEW","activeProgrammers":76},{"language":"Ada","activeProgrammers":74},{"language":"Gnuplot","activeProgrammers":74},{"language":"Red","activeProgrammers":73},{"language":"SystemVerilog","activeProgrammers":72},{"language":"SuperCollider","activeProgrammers":72},{"language":"Frege","activeProgrammers":70},{"language":"Smalltalk","activeProgrammers":70},{"language":"Agda","activeProgrammers":70},{"language":"Objective-J","activeProgrammers":68},{"language":"MoonScript","activeProgrammers":66},{"language":"ANTLR","activeProgrammers":65},{"language":"Perl6","activeProgrammers":63},{"language":"SAS","activeProgrammers":61},{"language":"Squirrel","activeProgrammers":59},{"language":"PAWN","activeProgrammers":51},{"language":"NetLogo","activeProgrammers":51},{"language":"Scilab","activeProgrammers":51},{"language":"DOT","activeProgrammers":50},{"language":"Eiffel","activeProgrammers":50},{"language":"Thrift","activeProgrammers":49},{"language":"J","activeProgrammers":46},{"language":"Propeller Spin","activeProgrammers":44},{"language":"Bison","activeProgrammers":43},{"language":"Arc","activeProgrammers":42},{"language":"Slash","activeProgrammers":41},{"language":"Idris","activeProgrammers":40},{"language":"Rebol","activeProgrammers":39},{"language":"Delphi","activeProgrammers":37},{"language":"AspectJ","activeProgrammers":35},{"language":"Io","activeProgrammers":35},{"language":"Brightscript","activeProgrammers":30},{"language":"XML","activeProgrammers":29},{"language":"Inform 7","activeProgrammers":29},{"language":"Factor","activeProgrammers":28},{"language":"Lasso","activeProgrammers":27},{"language":"Ceylon","activeProgrammers":27},{"language":"Bro","activeProgrammers":27},{"language":"PigLatin","activeProgrammers":26},{"language":"Augeas","activeProgrammers":26},{"language":"Forth","activeProgrammers":25},{"language":"Zephir","activeProgrammers":24},{"language":"wisp","activeProgrammers":24},{"language":"UnrealScript","activeProgrammers":24},{"language":"LSL","activeProgrammers":23},{"language":"xBase","activeProgrammers":22},{"language":"COBOL","activeProgrammers":20},{"language":"Bluespec","activeProgrammers":19},{"language":"XC","activeProgrammers":19},{"language":"Parrot","activeProgrammers":19},{"language":"GDScript","activeProgrammers":18},{"language":"CLIPS","activeProgrammers":18},{"language":"Component Pascal","activeProgrammers":18},{"language":"REALbasic","activeProgrammers":17},{"language":"ATS","activeProgrammers":16},{"language":"Papyrus","activeProgrammers":16},{"language":"FLUX","activeProgrammers":15},{"language":"Hy","activeProgrammers":15},{"language":"Hack","activeProgrammers":15},{"language":"Mirah","activeProgrammers":14},{"language":"Boo","activeProgrammers":14},{"language":"Grammatical Framework","activeProgrammers":14},{"language":"ooc","activeProgrammers":13},{"language":"Isabelle","activeProgrammers":13},{"language":"Monkey","activeProgrammers":13},{"language":"Dylan","activeProgrammers":12},{"language":"LookML","activeProgrammers":11},{"language":"Xojo","activeProgrammers":11},{"language":"Cycript","activeProgrammers":11},{"language":"Nu","activeProgrammers":11},{"language":"Pan","activeProgrammers":10},{"language":"EmberScript","activeProgrammers":10},{"language":"GAMS","activeProgrammers":10},{"language":"Ragel in Ruby Host","activeProgrammers":10},{"language":"ABAP","activeProgrammers":9},{"language":"Fantom","activeProgrammers":9},{"language":"RobotFramework","activeProgrammers":7},{"language":"JSONiq","activeProgrammers":7},{"language":"PogoScript","activeProgrammers":7},{"language":"Clean","activeProgrammers":6},{"language":"Ecl","activeProgrammers":6},{"language":"XProc","activeProgrammers":6},{"language":"Volt","activeProgrammers":5},{"language":"Self","activeProgrammers":5},{"language":"Chapel","activeProgrammers":5},{"language":"BlitzMax","activeProgrammers":5},{"language":"LOLCODE","activeProgrammers":5},{"language":"Harbour","activeProgrammers":4},{"language":"Turing","activeProgrammers":4},{"language":"Pike","activeProgrammers":4},{"language":"KRL","activeProgrammers":4},{"language":"Logtalk","activeProgrammers":4},{"language":"Glyph","activeProgrammers":3},{"language":"IGOR Pro","activeProgrammers":3},{"language":"APL","activeProgrammers":3},{"language":"eC","activeProgrammers":2},{"language":"Oxygene","activeProgrammers":2},{"language":"Fancy","activeProgrammers":2},{"language":"Grace","activeProgrammers":2},{"language":"DCPU-16 ASM","activeProgrammers":2},{"language":"Ox","activeProgrammers":2},{"language":"Shen","activeProgrammers":2},{"language":"Cirru","activeProgrammers":1},{"language":"Alloy","activeProgrammers":1},{"language":"Dogescript","activeProgrammers":1},{"language":"Opal","activeProgrammers":1},{"language":"TXL","activeProgrammers":1},{"language":"repository_language","activeProgrammers":1},{"language":"E","activeProgrammers":1}];

// we parse the data from the server into suitable formats for our React components.
// the variables below will store the reformatted data
var initialWorkflowData = {};
var formattedCountryData = {};
var sortedCountriesbyLanguageTop10 = [];

// defaults to initialWorkflow on page load
var selectedWorkflow = "initialWorkflow";
var searchedLanguage;

var DevSearchStore = assign({}, EventEmitter.prototype, {

// The next three methods below make an api request to the server
  getCountryDataFromServer: function() {
    $.ajax({
      url: 'api/1/allCountriesAllLanguages',
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        countryData = data;
        this.emitChange();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('api/1/getAllFiles', status, err.toString());
      }.bind(this)
    });
    var returnedData = countryData;
  },

  getDeveloperCountByCountryFromServer: function() {
    $.ajax({
      url: 'api/1/developerCountByCountry',
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        developersByCountryData = data || returnedData;
        this.emitChange();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('api/1/getDeveloperCountByCountry', status, err.toString());
      }.bind(this)
    });
    var returnedData = {"ATG":{"programmers2013":1,"programmers2014":3,"hourlyWage":3.91,"countryCode2":"AG","countryCode3":"ATG","countryName":"Antigua And Barbuda"},"AGO":{"programmers2013":3,"programmers2014":9,"hourlyWage":0.92,"countryCode2":"AO","countryCode3":"AGO","countryName":"Angola"},"ARG":{"programmers2013":1071,"programmers2014":1598,"hourlyWage":0.78,"countryCode2":"AR","countryCode3":"ARG","countryName":"Argentina"},"AUT":{"programmers2013":937,"programmers2014":1373,"hourlyWage":7.95,"countryCode2":"AT","countryCode3":"AUT","countryName":"Austria"},"AUS":{"programmers2013":3319,"programmers2014":4803,"hourlyWage":12.5,"countryCode2":"AU","countryCode3":"AUS","countryName":"Australia"},"BRB":{"programmers2013":3,"programmers2014":2,"hourlyWage":6.51,"countryCode2":"BB","countryCode3":"BRB","countryName":"Barbados"},"BGD":{"programmers2013":216,"programmers2014":499,"hourlyWage":0.65,"countryCode2":"BD","countryCode3":"BGD","countryName":"Bangladesh"},"BFA":{"programmers2013":2,"programmers2014":3,"hourlyWage":1.08,"countryCode2":"BF","countryCode3":"BFA","countryName":"Burkina Faso"},"BGR":{"programmers2013":474,"programmers2014":868,"hourlyWage":1.01,"countryCode2":"BG","countryCode3":"BGR","countryName":"Bulgaria"},"BHR":{"programmers2013":11,"programmers2014":14,"hourlyWage":5.52,"countryCode2":"BH","countryCode3":"BHR","countryName":"Bahrain"},"BEN":{"programmers2013":39,"programmers2014":73,"hourlyWage":1.76,"countryCode2":"BJ","countryCode3":"BEN","countryName":"Benin"},"BOL":{"programmers2013":51,"programmers2014":85,"hourlyWage":1.18,"countryCode2":"BO","countryCode3":"BOL","countryName":"Bolivia, Plurinational State Of"},"BRA":{"programmers2013":2797,"programmers2014":4441,"hourlyWage":3.18,"countryCode2":"BR","countryCode3":"BRA","countryName":"Brazil"},"BHS":{"programmers2013":1,"programmers2014":2,"hourlyWage":8,"countryCode2":"BS","countryCode3":"BHS","countryName":"Bahamas"},"CAN":{"programmers2013":5396,"programmers2014":8448,"hourlyWage":10.94,"countryCode2":"CA","countryCode3":"CAN","countryName":"Canada"},"CIV":{"programmers2013":4,"programmers2014":1,"hourlyWage":0.98,"countryCode2":"CI","countryCode3":"CIV","countryName":"Cote d'Ivoire"},"CHL":{"programmers2013":383,"programmers2014":607,"hourlyWage":5.49,"countryCode2":"CL","countryCode3":"CHL","countryName":"Chile"},"COL":{"programmers2013":342,"programmers2014":566,"hourlyWage":1.74,"countryCode2":"CO","countryCode3":"COL","countryName":"Colombia"},"CRI":{"programmers2013":139,"programmers2014":248,"hourlyWage":3.85,"countryCode2":"CR","countryCode3":"CRI","countryName":"Costa Rica"},"CYP":{"programmers2013":44,"programmers2014":83,"hourlyWage":3.18,"countryCode2":"CY","countryCode3":"CYP","countryName":"Cyprus"},"CZE":{"programmers2013":952,"programmers2014":1424,"hourlyWage":1.5,"countryCode2":"CZ","countryCode3":"CZE","countryName":"Czech Republic"},"DEU":{"programmers2013":8299,"programmers2014":12612,"hourlyWage":8.25,"countryCode2":"DE","countryCode3":"DEU","countryName":"Germany"},"DNK":{"programmers2013":1220,"programmers2014":1699,"hourlyWage":8.79,"countryCode2":"DK","countryCode3":"DNK","countryName":"Denmark"},"DOM":{"programmers2013":70,"programmers2014":126,"hourlyWage":0.91,"countryCode2":"DO","countryCode3":"DOM","countryName":"Dominican Republic"},"DZA":{"programmers2013":36,"programmers2014":62,"hourlyWage":3.52,"countryCode2":"DZ","countryCode3":"DZA","countryName":"Algeria"},"EGY":{"programmers2013":189,"programmers2014":334,"hourlyWage":0.97,"countryCode2":"EG","countryCode3":"EGY","countryName":"Egypt"},"ERI":{"programmers2013":103,"programmers2014":200,"hourlyWage":1.2,"countryCode2":"ER","countryCode3":"ERI","countryName":"Eritrea"},"FIN":{"programmers2013":941,"programmers2014":1443,"hourlyWage":7.26,"countryCode2":"FI","countryCode3":"FIN","countryName":"Finland"},"FJI":{"programmers2013":1,"programmers2014":1,"hourlyWage":6.07,"countryCode2":"FJ","countryCode3":"FJI","countryName":"Fiji"},"GBR":{"programmers2013":8877,"programmers2014":13400,"hourlyWage":24.33,"countryCode2":"GB","countryCode3":"GBR","countryName":"United Kingdom"},"GRD":{"programmers2013":2,"programmers2014":9,"hourlyWage":2.67,"countryCode2":"GD","countryCode3":"GRD","countryName":"Grenada"},"GHA":{"programmers2013":51,"programmers2014":76,"hourlyWage":2.45,"countryCode2":"GH","countryCode3":"GHA","countryName":"Ghana"},"GLP":{"programmers2013":4,"programmers2014":5,"hourlyWage":7.39,"countryCode2":"GP","countryCode3":"GLP","countryName":"Guadeloupe"},"GTM":{"programmers2013":61,"programmers2014":108,"hourlyWage":2.51,"countryCode2":"GT","countryCode3":"GTM","countryName":"Guatemala"},"HKG":{"programmers2013":331,"programmers2014":556,"hourlyWage":5.36,"countryCode2":"HK","countryCode3":"HKG","countryName":"Hong Kong"},"HND":{"programmers2013":41,"programmers2014":46,"hourlyWage":2.52,"countryCode2":"HN","countryCode3":"HND","countryName":"Honduras"},"HRV":{"programmers2013":254,"programmers2014":370,"hourlyWage":3.84,"countryCode2":"HR","countryCode3":"HRV","countryName":"Croatia"},"HUN":{"programmers2013":513,"programmers2014":786,"hourlyWage":3.23,"countryCode2":"HU","countryCode3":"HUN","countryName":"Hungary"},"IMN":{"programmers2013":5,"programmers2014":6,"hourlyWage":4.8,"countryCode2":"IM","countryCode3":"IMN","countryName":"Isle Of Man"},"IND":{"programmers2013":4494,"programmers2014":8134,"hourlyWage":1.19,"countryCode2":"IN","countryCode3":"IND","countryName":"India"},"ITA":{"programmers2013":1965,"programmers2014":2975,"hourlyWage":4.76,"countryCode2":"IT","countryCode3":"ITA","countryName":"Italy"},"JOR":{"programmers2013":41,"programmers2014":79,"hourlyWage":1.93,"countryCode2":"JO","countryCode3":"JOR","countryName":"Jordan"},"JPN":{"programmers2013":4266,"programmers2014":5923,"hourlyWage":4.59,"countryCode2":"JP","countryCode3":"JPN","countryName":"Japan"},"KEN":{"programmers2013":122,"programmers2014":230,"hourlyWage":4.65,"countryCode2":"KE","countryCode3":"KEN","countryName":"Kenya"},"COM":{"programmers2013":1,"programmers2014":1,"hourlyWage":0.67,"countryCode2":"KM","countryCode3":"COM","countryName":"Comoros"},"KOR":{"programmers2013":1007,"programmers2014":1559,"hourlyWage":2.26,"countryCode2":"KR","countryCode3":"KOR","countryName":"Korea, Republic Of"},"KWT":{"programmers2013":15,"programmers2014":28,"hourlyWage":6.71,"countryCode2":"KW","countryCode3":"KWT","countryName":"Kuwait"},"KAZ":{"programmers2013":68,"programmers2014":141,"hourlyWage":1.4,"countryCode2":"KZ","countryCode3":"KAZ","countryName":"Kazakhstan"},"LCA":{"programmers2013":1,"programmers2014":2,"hourlyWage":5.77,"countryCode2":"LC","countryCode3":"LCA","countryName":"Saint Lucia"},"LTU":{"programmers2013":227,"programmers2014":366,"hourlyWage":1.09,"countryCode2":"LT","countryCode3":"LTU","countryName":"Lithuania"},"LUX":{"programmers2013":74,"programmers2014":136,"hourlyWage":27.94,"countryCode2":"LU","countryCode3":"LUX","countryName":"Luxembourg"},"LVA":{"programmers2013":204,"programmers2014":263,"hourlyWage":1.54,"countryCode2":"LV","countryCode3":"LVA","countryName":"Latvia"},"MDA":{"programmers2013":79,"programmers2014":120,"hourlyWage":0.43,"countryCode2":"MD","countryCode3":"MDA","countryName":"Moldova"},"MDG":{"programmers2013":11,"programmers2014":24,"hourlyWage":0.35,"countryCode2":"MG","countryCode3":"MDG","countryName":"Madagascar"},"MMR":{"programmers2013":31,"programmers2014":51,"hourlyWage":1.08,"countryCode2":"MM","countryCode3":"MMR","countryName":"Myanmar"},"MWI":{"programmers2013":7,"programmers2014":8,"hourlyWage":2.93,"countryCode2":"MW","countryCode3":"MWI","countryName":"Malawi"},"MEX":{"programmers2013":679,"programmers2014":980,"hourlyWage":3.5,"countryCode2":"MX","countryCode3":"MEX","countryName":"Mexico"},"MOZ":{"programmers2013":2,"programmers2014":5,"hourlyWage":0.47,"countryCode2":"MZ","countryCode3":"MOZ","countryName":"Mozambique"},"NAM":{"programmers2013":6,"programmers2014":16,"hourlyWage":8.59,"countryCode2":"NA","countryCode3":"NAM","countryName":"Namibia"},"NGA":{"programmers2013":60,"programmers2014":152,"hourlyWage":3.12,"countryCode2":"NG","countryCode3":"NGA","countryName":"Nigeria"},"NIC":{"programmers2013":28,"programmers2014":53,"hourlyWage":3.41,"countryCode2":"NI","countryCode3":"NIC","countryName":"Nicaragua"},"NZL":{"programmers2013":861,"programmers2014":1344,"hourlyWage":5.49,"countryCode2":"NZ","countryCode3":"NZL","countryName":"New Zealand"},"PER":{"programmers2013":133,"programmers2014":171,"hourlyWage":0.56,"countryCode2":"PE","countryCode3":"PER","countryName":"Peru"},"PYF":{"programmers2013":4,"programmers2014":4,"hourlyWage":13.38,"countryCode2":"PF","countryCode3":"PYF","countryName":"French Polynesia"},"PNG":{"programmers2013":1,"programmers2014":1,"hourlyWage":2.85,"countryCode2":"PG","countryCode3":"PNG","countryName":"Papua New Guinea"},"PHL":{"programmers2013":486,"programmers2014":740,"hourlyWage":1.84,"countryCode2":"PH","countryCode3":"PHL","countryName":"Philippines"},"PAK":{"programmers2013":208,"programmers2014":379,"hourlyWage":0.88,"countryCode2":"PK","countryCode3":"PAK","countryName":"Pakistan"},"POL":{"programmers2013":1526,"programmers2014":2429,"hourlyWage":3.09,"countryCode2":"PL","countryCode3":"POL","countryName":"Poland"},"PRI":{"programmers2013":59,"programmers2014":84,"hourlyWage":9.11,"countryCode2":"PR","countryCode3":"PRI","countryName":"Puerto Rico"},"PRT":{"programmers2013":795,"programmers2014":1255,"hourlyWage":9.49,"countryCode2":"PT","countryCode3":"PRT","countryName":"Portugal"},"ROU":{"programmers2013":622,"programmers2014":898,"hourlyWage":1.08,"countryCode2":"RO","countryCode3":"ROU","countryName":"Romania"},"RWA":{"programmers2013":5,"programmers2014":21,"hourlyWage":1.26,"countryCode2":"RW","countryCode3":"RWA","countryName":"Rwanda"},"SDN":{"programmers2013":3,"programmers2014":7,"hourlyWage":1.06,"countryCode2":"SD","countryCode3":"SDN","countryName":"Sudan"},"SWE":{"programmers2013":2181,"programmers2014":3198,"hourlyWage":6.62,"countryCode2":"SE","countryCode3":"SWE","countryName":"Sweden"},"SGP":{"programmers2013":585,"programmers2014":1022,"hourlyWage":4.47,"countryCode2":"SG","countryCode3":"SGP","countryName":"Singapore"},"SVN":{"programmers2013":200,"programmers2014":302,"hourlyWage":6.22,"countryCode2":"SI","countryCode3":"SVN","countryName":"Slovenia"},"SVK":{"programmers2013":223,"programmers2014":333,"hourlyWage":1.32,"countryCode2":"SK","countryCode3":"SVK","countryName":"Slovakia"},"SEN":{"programmers2013":11,"programmers2014":14,"hourlyWage":4.09,"countryCode2":"SN","countryCode3":"SEN","countryName":"Senegal"},"SLV":{"programmers2013":54,"programmers2014":87,"hourlyWage":2.19,"countryCode2":"SV","countryCode3":"SLV","countryName":"El Salvador"},"TCD":{"programmers2013":1,"programmers2014":1,"hourlyWage":1.55,"countryCode2":"TD","countryCode3":"TCD","countryName":"Chad"},"THA":{"programmers2013":302,"programmers2014":584,"hourlyWage":1.65,"countryCode2":"TH","countryCode3":"THA","countryName":"Thailand"},"TUN":{"programmers2013":89,"programmers2014":124,"hourlyWage":1.31,"countryCode2":"TN","countryCode3":"TUN","countryName":"Tunisia"},"TTO":{"programmers2013":9,"programmers2014":16,"hourlyWage":5.97,"countryCode2":"TT","countryCode3":"TTO","countryName":"Trinidad And Tobago"},"TWN":{"programmers2013":1039,"programmers2014":1677,"hourlyWage":6.44,"countryCode2":"TW","countryCode3":"TWN","countryName":"Taiwan, Province Of China"},"UGA":{"programmers2013":33,"programmers2014":58,"hourlyWage":0.62,"countryCode2":"UG","countryCode3":"UGA","countryName":"Uganda"},"USA":{"programmers2013":47736,"programmers2014":74250,"hourlyWage":14.34,"countryCode2":"US","countryCode3":"USA","countryName":"United States"},"VCT":{"programmers2013":2,"programmers2014":1,"hourlyWage":5.92,"countryCode2":"VC","countryCode3":"VCT","countryName":"Saint Vincent And The Grenadines"},"VEN":{"programmers2013":199,"programmers2014":344,"hourlyWage":7.07,"countryCode2":"VE","countryCode3":"VEN","countryName":"Venezuela, Bolivarian Republic Of"},"VIR":{"programmers2013":2,"programmers2014":1,"hourlyWage":11.31,"countryCode2":"VI","countryCode3":"VIR","countryName":"Virgin Islands (US)"},"ZMB":{"programmers2013":3,"programmers2014":5,"hourlyWage":0.656506,"countryCode2":"ZM","countryCode3":"ZMB","countryName":"Zambia"},"ZWE":{"programmers2013":5,"programmers2014":13,"hourlyWage":2.26383,"countryCode2":"ZW","countryCode3":"ZWE","countryName":"Zimbabwe"}};
  },

  getDeveloperCountByLanguageFromServer: function() {
    $.ajax({
      url: 'api/1/developerCountByLanguage',
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        developersByLanguage = data || returnedData;
        this.emitChange();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('api/1/getDeveloperCountByLanguage', status, err.toString());
      }.bind(this)
    });
    var returnedData= [{"language":"JavaScript","activeProgrammers":224050},{"language":"Java","activeProgrammers":139127},{"language":"Python","activeProgrammers":116128},{"language":"CSS","activeProgrammers":113774},{"language":"PHP","activeProgrammers":80705},{"language":"C++","activeProgrammers":70489},{"language":"Ruby","activeProgrammers":70029},{"language":"C","activeProgrammers":67456},{"language":"Shell","activeProgrammers":45709},{"language":"C#","activeProgrammers":44479},{"language":"Objective-C","activeProgrammers":37411},{"language":"Go","activeProgrammers":22434},{"language":"CoffeeScript","activeProgrammers":16843},{"language":"VimL","activeProgrammers":15904},{"language":"R","activeProgrammers":12313},{"language":"Scala","activeProgrammers":10446},{"language":"Swift","activeProgrammers":9763},{"language":"TeX","activeProgrammers":9233},{"language":"Perl","activeProgrammers":9091},{"language":"Lua","activeProgrammers":5853},{"language":"Emacs Lisp","activeProgrammers":5601},{"language":"Clojure","activeProgrammers":4742},{"language":"Haskell","activeProgrammers":4433},{"language":"OCaml","activeProgrammers":4304},{"language":"Matlab","activeProgrammers":4007},{"language":"Groovy","activeProgrammers":3868},{"language":"TypeScript","activeProgrammers":3693},{"language":"Arduino","activeProgrammers":3023},{"language":"Rust","activeProgrammers":2851},{"language":"PowerShell","activeProgrammers":2768},{"language":"Erlang","activeProgrammers":2396},{"language":"Puppet","activeProgrammers":2246},{"language":"XSLT","activeProgrammers":1994},{"language":"Assembly","activeProgrammers":1895},{"language":"ActionScript","activeProgrammers":1858},{"language":"Visual Basic","activeProgrammers":1794},{"language":"Processing","activeProgrammers":1413},{"language":"Makefile","activeProgrammers":1397},{"language":"Elixir","activeProgrammers":1231},{"language":"ASP","activeProgrammers":1164},{"language":"D","activeProgrammers":1101},{"language":"Julia","activeProgrammers":1026},{"language":"Scheme","activeProgrammers":1006},{"language":"Haxe","activeProgrammers":983},{"language":"Objective-C++","activeProgrammers":934},{"language":"Prolog","activeProgrammers":896},{"language":"F#","activeProgrammers":888},{"language":"Common Lisp","activeProgrammers":861},{"language":"Dart","activeProgrammers":766},{"language":"Pascal","activeProgrammers":753},{"language":"FORTRAN","activeProgrammers":749},{"language":"AGS Script","activeProgrammers":638},{"language":"Stata","activeProgrammers":559},{"language":"Racket","activeProgrammers":512},{"language":"Verilog","activeProgrammers":500},{"language":"VHDL","activeProgrammers":495},{"language":"Vala","activeProgrammers":471},{"language":"AppleScript","activeProgrammers":430},{"language":"Kotlin","activeProgrammers":425},{"language":"DM","activeProgrammers":381},{"language":"Mathematica","activeProgrammers":344},{"language":"SQF","activeProgrammers":338},{"language":"Cuda","activeProgrammers":332},{"language":"IDL","activeProgrammers":318},{"language":"Logos","activeProgrammers":305},{"language":"Nix","activeProgrammers":295},{"language":"OpenSCAD","activeProgrammers":289},{"language":"Tcl","activeProgrammers":274},{"language":"Crystal","activeProgrammers":273},{"language":"AutoHotkey","activeProgrammers":261},{"language":"Game Maker Language","activeProgrammers":258},{"language":"Apex","activeProgrammers":254},{"language":"LiveScript","activeProgrammers":252},{"language":"Standard ML","activeProgrammers":233},{"language":"OpenEdge ABL","activeProgrammers":228},{"language":"ColdFusion","activeProgrammers":218},{"language":"M","activeProgrammers":216},{"language":"Gosu","activeProgrammers":194},{"language":"Elm","activeProgrammers":194},{"language":"BlitzBasic","activeProgrammers":188},{"language":"Max","activeProgrammers":177},{"language":"SourcePawn","activeProgrammers":150},{"language":"PureScript","activeProgrammers":147},{"language":"Coq","activeProgrammers":138},{"language":"Nemerle","activeProgrammers":130},{"language":"Mercury","activeProgrammers":125},{"language":"nesC","activeProgrammers":121},{"language":"SQL","activeProgrammers":111},{"language":"Pure Data","activeProgrammers":108},{"language":"Nimrod","activeProgrammers":105},{"language":"XQuery","activeProgrammers":105},{"language":"Awk","activeProgrammers":99},{"language":"AutoIt","activeProgrammers":97},{"language":"VCL","activeProgrammers":92},{"language":"Xtend","activeProgrammers":89},{"language":"GAP","activeProgrammers":82},{"language":"LabVIEW","activeProgrammers":76},{"language":"Ada","activeProgrammers":74},{"language":"Gnuplot","activeProgrammers":74},{"language":"Red","activeProgrammers":73},{"language":"SystemVerilog","activeProgrammers":72},{"language":"SuperCollider","activeProgrammers":72},{"language":"Frege","activeProgrammers":70},{"language":"Smalltalk","activeProgrammers":70},{"language":"Agda","activeProgrammers":70},{"language":"Objective-J","activeProgrammers":68},{"language":"MoonScript","activeProgrammers":66},{"language":"ANTLR","activeProgrammers":65},{"language":"Perl6","activeProgrammers":63},{"language":"SAS","activeProgrammers":61},{"language":"Squirrel","activeProgrammers":59},{"language":"PAWN","activeProgrammers":51},{"language":"NetLogo","activeProgrammers":51},{"language":"Scilab","activeProgrammers":51},{"language":"DOT","activeProgrammers":50},{"language":"Eiffel","activeProgrammers":50},{"language":"Thrift","activeProgrammers":49},{"language":"J","activeProgrammers":46},{"language":"Propeller Spin","activeProgrammers":44},{"language":"Bison","activeProgrammers":43},{"language":"Arc","activeProgrammers":42},{"language":"Slash","activeProgrammers":41},{"language":"Idris","activeProgrammers":40},{"language":"Rebol","activeProgrammers":39},{"language":"Delphi","activeProgrammers":37},{"language":"AspectJ","activeProgrammers":35},{"language":"Io","activeProgrammers":35},{"language":"Brightscript","activeProgrammers":30},{"language":"XML","activeProgrammers":29},{"language":"Inform 7","activeProgrammers":29},{"language":"Factor","activeProgrammers":28},{"language":"Lasso","activeProgrammers":27},{"language":"Ceylon","activeProgrammers":27},{"language":"Bro","activeProgrammers":27},{"language":"PigLatin","activeProgrammers":26},{"language":"Augeas","activeProgrammers":26},{"language":"Forth","activeProgrammers":25},{"language":"Zephir","activeProgrammers":24},{"language":"wisp","activeProgrammers":24},{"language":"UnrealScript","activeProgrammers":24},{"language":"LSL","activeProgrammers":23},{"language":"xBase","activeProgrammers":22},{"language":"COBOL","activeProgrammers":20},{"language":"Bluespec","activeProgrammers":19},{"language":"XC","activeProgrammers":19},{"language":"Parrot","activeProgrammers":19},{"language":"GDScript","activeProgrammers":18},{"language":"CLIPS","activeProgrammers":18},{"language":"Component Pascal","activeProgrammers":18},{"language":"REALbasic","activeProgrammers":17},{"language":"ATS","activeProgrammers":16},{"language":"Papyrus","activeProgrammers":16},{"language":"FLUX","activeProgrammers":15},{"language":"Hy","activeProgrammers":15},{"language":"Hack","activeProgrammers":15},{"language":"Mirah","activeProgrammers":14},{"language":"Boo","activeProgrammers":14},{"language":"Grammatical Framework","activeProgrammers":14},{"language":"ooc","activeProgrammers":13},{"language":"Isabelle","activeProgrammers":13},{"language":"Monkey","activeProgrammers":13},{"language":"Dylan","activeProgrammers":12},{"language":"LookML","activeProgrammers":11},{"language":"Xojo","activeProgrammers":11},{"language":"Cycript","activeProgrammers":11},{"language":"Nu","activeProgrammers":11},{"language":"Pan","activeProgrammers":10},{"language":"EmberScript","activeProgrammers":10},{"language":"GAMS","activeProgrammers":10},{"language":"Ragel in Ruby Host","activeProgrammers":10},{"language":"ABAP","activeProgrammers":9},{"language":"Fantom","activeProgrammers":9},{"language":"RobotFramework","activeProgrammers":7},{"language":"JSONiq","activeProgrammers":7},{"language":"PogoScript","activeProgrammers":7},{"language":"Clean","activeProgrammers":6},{"language":"Ecl","activeProgrammers":6},{"language":"XProc","activeProgrammers":6},{"language":"Volt","activeProgrammers":5},{"language":"Self","activeProgrammers":5},{"language":"Chapel","activeProgrammers":5},{"language":"BlitzMax","activeProgrammers":5},{"language":"LOLCODE","activeProgrammers":5},{"language":"Harbour","activeProgrammers":4},{"language":"Turing","activeProgrammers":4},{"language":"Pike","activeProgrammers":4},{"language":"KRL","activeProgrammers":4},{"language":"Logtalk","activeProgrammers":4},{"language":"Glyph","activeProgrammers":3},{"language":"IGOR Pro","activeProgrammers":3},{"language":"APL","activeProgrammers":3},{"language":"eC","activeProgrammers":2},{"language":"Oxygene","activeProgrammers":2},{"language":"Fancy","activeProgrammers":2},{"language":"Grace","activeProgrammers":2},{"language":"DCPU-16 ASM","activeProgrammers":2},{"language":"Ox","activeProgrammers":2},{"language":"Shen","activeProgrammers":2},{"language":"Cirru","activeProgrammers":1},{"language":"Alloy","activeProgrammers":1},{"language":"Dogescript","activeProgrammers":1},{"language":"Opal","activeProgrammers":1},{"language":"TXL","activeProgrammers":1},{"language":"repository_language","activeProgrammers":1},{"language":"E","activeProgrammers":1}];
  },

// returns top ten programming languages globally and top language for each country 
// this is the default data for the map, before the user selects a workflow.
	formatInitialWorkflowData: function(){
		var topTenGlobalLangs = [];
		for(var i = 0; i < 10; i++){
			topTenGlobalLangs.push([]);
			topTenGlobalLangs[i].push(developersByLanguage[i]["language"]);
			topTenGlobalLangs[i].push(this.numberWithCommas(developersByLanguage[i]["activeProgrammers"]));
		}
		initialWorkflowData["topTenLangs"] = topTenGlobalLangs;
		initialWorkflowData["topLangsInCountryColors"] = countryData;  
	},

// returns the most popular languages for each country, the average hourly wage, and the % yearly growth in number of developers 
  formatCountryData: function(country) {
  	var country = country || "United States";
    // countryNameAbbrev & standardizedCountryName are used to format the raw countryData
    var countryNameAbbrev = { "Afghanistan":"AFG", "Andorra":"AND", "Angola":"AGO", "Albania":"ALB", "Algeria": "DZA", "United Arab Emirates": "ARE", "Argentina": "ARG", "Armenia": "ARM", "Antarctica": "ATA", "Australia": "AUS", "Austria": "AUT", "Azerbaijan": "AZE", "Bahrain": "BHR", "Bermuda": "BMU", "Burundi": "BDI", "Belgium": "BEL", "Benin": "BEN", "Burkina Faso": "BFA", "Bangladesh": "BGD", "Bulgaria": "BGR", "The Bahamas": "BHS", "Bahamas": "BHS", "Bosnia and Herzegovina": "BIH", "Bosnia & Herzegovina": "BIH", "Belarus": "BLR", "Belize": "BLZ", "Bolivia": "BOL", "Bolivia, Plurinational State Of": "BOL", "Brazil": "BRA", "Brunei": "BRN", "Brunei Darussalam": "BRN", "Bhutan": "BTN", "Botswana": "BWA", "Central African Republic": "CAF", "Cambodia": "KHM", "Canada": "CAN", "Chad": "TCD", "Chile": "CHL", "China": "CHN", "Ivory Coast": "CIV", "Cote d'Ivoire": "CIV", "Cameroon": "CMR", "Central African Republic":"CAF", "Democratic Republic Of Congo": "COD", "Democratic Republic of the Congo": "COD", "Republic of the Congo": "COG", "Colombia": "COL", "Costa Rica": "CRI", "Croatia": "HRV", "Cuba": "CUB", "Cyprus": "CYP", "Czech Republic": "CZE", "Djibouti": "DJI", "Denmark": "DNK", "Dominican Republic": "DOM", "East Timor": "TLS", "Ecuador": "ECU", "Egypt": "EGY", "El Salvador": "SLV", "Eritrea": "ERI", "Estonia": "EST", "Ethiopia": "ETH", "Finland": "FIN", "Fiji": "FJI", "Falkland Islands": "FLK", "France": "FRA", "French Guiana": "GUF", "Gabon": "GAB", "United Kingdom": "GBR", "Georgia": "GEO", "Germany": "DEU", "Ghana": "GHA", "Guinea": "GIN", "Gambia": "GMB", "Guinea Bissau": "GNB", "Equatorial Guinea": "GNQ", "Greece": "GRC", "Greenland": "GRL", "Guatemala": "GTM", "Guyana": "GUY", "Honduras": "HND", "Hong Kong": "HKG", "Haiti": "HTI", "Hungary": "HUN", "Indonesia": "IDN", "India": "IND", "Ireland": "IRL", "Iran": "IRN", "Iran, Islamic Republic Of": "IRN", "Iraq": "IRQ", "Iceland": "ISL", "Israel": "ISR", "Italy": "ITA", "Jamaica": "JAM", "Jordan": "JOR", "Japan": "JPN", "Kazakhstan": "KAZ", "Kenya": "KEN", "Kyrgyzstan": "KGZ", "Kuwait": "KWT", "Laos": "LAO", "Lao People's Democratic Republic": "LAO", "Lebanon": "LBN", "Liberia": "LBR", "Libya": "LBY", "Lesotho": "LSO", "Liechtenstein": "LIE", "Lithuania": "LTU", "Luxembourg": "LUX", "Latvia": "LVA", "Morocco": "MAR", "Moldova": "MDA", "Madagascar": "MDG", "Mexico": "MEX", "Macedonia": "MKD", "Macedonia, The Former Yugoslav Republic Of": "MKD", "Mali": "MLI", "Myanmar": "MMR", "Monaco": "MCO", "Montenegro": "MNE", "Mongolia": "MNG", "Mozambique": "MOZ", "Mauritania": "MRT", "Malawi": "MWI", "Malaysia": "MYS", "Namibia": "NAM", "Niger": "NER", "Nigeria": "NGA", "Nicaragua": "NIC", "Netherlands": "NLD", "Norway": "NOR", "Nepal": "NPL", "New Zealand": "NZL", "Oman": "OMN", "Pakistan": "PAK", "Panama": "PAN", "Peru": "PER", "Philippines": "PHL", "Papua New Guinea": "PNG", "Poland": "POL", "Puerto Rico": "PRI", "North Korea": "PRK", "Korea, Democratic People's Republic Of": "PRK", "Portugal": "PRT", "Paraguay": "PRY", "Qatar": "QAT", "Romania": "ROU", "Russia": "RUS", "Russian Federation": "RUS", "Rwanda": "RWA", "Saudi Arabia": "SAU", "Sudan": "SDN", "Senegal": "SEN", "Serbia": "SRB", "Republic of Serbia": "SRB", "Solomon Islands": "SLB", "Sierra Leone": "SLE", "Singapore": "SGP", "Slovakia": "SVK", "Slovenia": "SVN", "Somalia": "SOM", "South Sudan":"SSD" ,"South Africa":"ZAF", "Korea": "KOR", "South Korea": "KOR", "Korea, Republic Of": "KOR", "Spain": "ESP", "Sri Lanka": "LKA", "Suriname": "SUR", "Sweden": "SWE", "Swaziland": "SWZ", "Switzerland": "CHE", "Syria": "SYR", "Syrian Arab Republic": "SYR", "Tajikistan": "TJK", "Tanzania, United Republic Of": "TZA", "Thailand": "THA", "Togo": "TGO", "Trinidad and Tobago":"TTO", "Turkmenistan":"TKM", "Tunisia":"TUN", "Turkey":"TUR", "Taiwan":"TWN", "Taiwan, Province Of China":"TWN", "United Republic of Tanzania":"TZA", "Tanzania":"TZA", "Uganda":"UGA", "Ukraine":"UKR", "Uruguay":"URY", "USA":"USA", "United States":"USA", "United States of America":"USA", "Uzbekistan":"UZB", "Venezuela":"VEN", "Venezuela, Bolivarian Republic Of":"VEN", "Vietnam":"VNM", "Viet Nam":"VNM", "Vanuatu":"VUT", "Yemen":"YEM", "Zambia":"ZMB", "Zimbabwe":"ZWE" };
    var standardizedCountryName = { "USA":"United States", "BIH":"Bosnia & Herzegovina", "BOL":"Bolivia", "BRN":"Brunei", "CIV":"Ivory Coast",  "COD":"Democratic Republic Of Congo", "VNM":"Vietnam", "VEN":"Venezuela", "TZA":"Tanzania", "TWN":"Taiwan", "SYR":"Syria",  "KOR":"South Korea", "SRB":"Serbia", "RUS":"Russia", "PRK":"North Korea", "MKD":"Macedonia", "LAO":"Laos", "IRN":"Iran" };
  	var countrySpecificData = {};  	
		countrySpecificData["countryCode3"] = countryNameAbbrev[country];
		countrySpecificData["fillKey"] = countryNameAbbrev[country];
		var countryCode = countryNameAbbrev[country];
  	
		if(standardizedCountryName[countryCode]){
			countrySpecificData["countryName"] = standardizedCountryName[countryCode];
		} else {
	  	countrySpecificData["countryName"] = country;
		};

		if(countryData[countryCode]){
			countrySpecificData["countryCode2"] = countryData[countryCode]["countryCode2"];
			countrySpecificData["mostPopularLang"] = countryData[countryCode]["fillKey"];
  		countrySpecificData["hourlyWage"] = countryData[countryCode]["hourlyWage"];
		} else {
			countrySpecificData["countryCode2"] = 0;
			countrySpecificData["mostPopularLang"] = 0;
  		countrySpecificData["hourlyWage"] = 0;
		};

		if(developersByCountryData[countryCode]){
	  	countrySpecificData["programmers2013"] = developersByCountryData[countryCode]["programmers2013"];
		} else {
	  	countrySpecificData["programmers2013"] = 0;			
		};

		if(developersByCountryData[countryCode]){
	  	countrySpecificData["programmers2014"] = developersByCountryData[countryCode]["programmers2014"];
		} else {
	  	countrySpecificData["programmers2014"] = 0;			
		};
  	
  	countrySpecificData["growthRate"] = Math.floor(100*(countrySpecificData["programmers2014"] - countrySpecificData["programmers2013"])/countrySpecificData["programmers2013"]);
  	
  	countrySpecificData["topLangs"] = [];
  	for(var i = 0; i < 10; i++){
  		if(countryData[countryCode]["allLangs"][i]){
	  		countrySpecificData["topLangs"].push(countryData[countryCode]["allLangs"][i][0]);
  		} else {
	  		countrySpecificData["topLangs"].push("Not available");  			
  		}
  	};
  	countrySpecificData["numDevs"] = [];
  	for(var i = 0; i < 10; i++){
  		if(countryData[countryCode]["allLangs"][i]){  		
	  		countrySpecificData["numDevs"].push(this.numberWithCommas(countryData[countryCode]["allLangs"][i][1]));
	  	} else {
	  		countrySpecificData["numDevs"].push("-");	  		
	  	}
  	};
  	formattedCountryData = countrySpecificData;
  },

// returns the top 10 countries by number of active developers for each language
  sortTop10CountriesByLanguage: function(language) {
    var countryLanguageCount = [];
    var language = language || 'JavaScript';
    // iterate through countryData object
    searchedLanguage = language;
    for(var country in countryData) {
      var countryInfo = {};
      // grab languages data for each country
      for (var i = 0; i < countryData[country].allLangs.length; i++) {
        if(countryData[country].allLangs[i][0].toLowerCase() === language.toLowerCase()) {
          countryInfo["countryCode3"] = countryData[country]["countryCode3"];
          countryInfo["activeProgrammers"] = countryData[country].allLangs[i][1];
          countryInfo["formattedLanguage"] = countryData[country].allLangs[i][0];
          countryInfo["language"] = language;
          countryInfo["countryName"] = countryData[country].countryName;
          countryInfo["fillKey"] = countryData[country].fillKey;
          countryLanguageCount.push(countryInfo);
        }
      }    
    }
    var sortedCountriesByLanguageAll = _.sortBy(countryLanguageCount, function(country) {
      return country.activeProgrammers * -1;
    });
    sortedCountriesbyLanguageTop10 = sortedCountriesByLanguageAll.slice(0,10);
  },

  switchWorkflow: function(workflow) {
    selectedWorkflow = workflow;
  },

// The 'get' methods below allow the React components to access data from the store,
  getInitialWorkflowData: function() {
    return initialWorkflowData;
  },

  getLanguage: function(){
  	return searchedLanguage;
  },

  getFormattedCountryData: function() {
    return formattedCountryData;
  },
  
  getTop10CountriesByLanguage: function() {
    return sortedCountriesbyLanguageTop10;
  },

  getWorkflow: function(workflow) {
    return selectedWorkflow;
  },

// helper function to add commas to large numbers
  numberWithCommas: function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

// Register callback to handle all updates
dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;
    var input = action.input; // input could be either a language or a country
    var workflow = action.workflow;

    //incoming callbacks/changes
    switch(action.actionType) {
      case 'DISPLAY_LANGUAGE_DATA':
        DevSearchStore.sortTop10CountriesByLanguage(input);
        DevSearchStore.emitChange();
        break;
      case 'DISPLAY_COUNTRY_DATA':
        DevSearchStore.formatCountryData(input);
        DevSearchStore.emitChange();
        break;
      case 'SWITCH_WORKFLOW':
        DevSearchStore.switchWorkflow(workflow);
        DevSearchStore.emitChange();
        break;
    };

    // returning true indicates there are no errors
    return true;

  })
});

module.exports = DevSearchStore;



},{"../constants/DevSearchConstants":22,"../dispatcher/AppDispatcher":24,"events":27,"object-assign":33,"underscore":181}],26:[function(require,module,exports){
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ProfilesConstants = require('../constants/DevSearchConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var profileData = [];
var selectedLanguage = "";
var selectedCountry = "";
var selectedHourlyRateMax = "";
var selectedMinScore = 0;
var selectedMaxScore = 0;
var page = 0;

var ProfilesStore = assign({}, EventEmitter.prototype, {
  
  getProfileDataFromServer: function(language, country, hourlyRateMax, minScore, maxScore, page) {
    return this.getCoders(language,country, hourlyRateMax, minScore, maxScore, page);
  },

  getCoders: function(language,country, hourlyRateMax, minScore, maxScore, page) {
    selectedLanguage = language;
    selectedCountry = country; 
    selectedHourlyRateMax = hourlyRateMax;
    selectedMinScore = minScore;
    selectedMaxScore = maxScore;
    page = page || 0;
    var url =  'api/1/coders?page=' + page + '=&language=' + language + '=&country=' + country + '=&hourlyRateMax=' + hourlyRateMax + '=&minScore=' + minScore + '=&maxScore=' + maxScore;

    $.ajax({
      url: url,
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        console.log('hey there', data);
        profileData = data;
        this.emitChange();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('api/1/getAllFiles', status, err.toString());
      }.bind(this)
    });

  },

  getProfileDataFromStore: function() {
    return profileData;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  // Register callback to handle all updates
  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;
    var language = action.language || 'JavaScript';
    var country = action.country || 'Thailand';
    var hourlyRateMax = action.hourlyRateMax || '100';
    var minScore = action.minScore || 0;
    var maxScore = action.maxScore || 5;
    var page = action.page || 0;

    //incoming callbacks/changes
    switch(action.actionType) {
      case 'GET_CODERS':
        ProfilesStore.getProfileDataFromServer(language, country, hourlyRateMax, minScore, maxScore);
        ProfilesStore.emitChange();
        break;
      case 'PROFILES_NEXT_PAGE':
        ProfilesStore.getProfileDataFromServer(selectedLanguage, selectedCountry, selectedHourlyRateMax, selectedMinScore, selectedMaxScore, page);
        ProfilesStore.emitChange();
        break;
    };

    // returning true indicates there are no errors
    return true;

  })
});

module.exports = ProfilesStore;



},{"../constants/DevSearchConstants":22,"../dispatcher/AppDispatcher":24,"events":27,"object-assign":33}],27:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],28:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],29:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

module.exports.Dispatcher = require('./lib/Dispatcher')

},{"./lib/Dispatcher":30}],30:[function(require,module,exports){
/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * @typechecks
 */

"use strict";

var invariant = require('./invariant');

var _lastID = 1;
var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *
 *         case 'city-update':
 *           FlightPriceStore.price =
 *             FlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */

  function Dispatcher() {
    this.$Dispatcher_callbacks = {};
    this.$Dispatcher_isPending = {};
    this.$Dispatcher_isHandled = {};
    this.$Dispatcher_isDispatching = false;
    this.$Dispatcher_pendingPayload = null;
  }

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   *
   * @param {function} callback
   * @return {string}
   */
  Dispatcher.prototype.register=function(callback) {
    var id = _prefix + _lastID++;
    this.$Dispatcher_callbacks[id] = callback;
    return id;
  };

  /**
   * Removes a callback based on its token.
   *
   * @param {string} id
   */
  Dispatcher.prototype.unregister=function(id) {
    invariant(
      this.$Dispatcher_callbacks[id],
      'Dispatcher.unregister(...): `%s` does not map to a registered callback.',
      id
    );
    delete this.$Dispatcher_callbacks[id];
  };

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   *
   * @param {array<string>} ids
   */
  Dispatcher.prototype.waitFor=function(ids) {
    invariant(
      this.$Dispatcher_isDispatching,
      'Dispatcher.waitFor(...): Must be invoked while dispatching.'
    );
    for (var ii = 0; ii < ids.length; ii++) {
      var id = ids[ii];
      if (this.$Dispatcher_isPending[id]) {
        invariant(
          this.$Dispatcher_isHandled[id],
          'Dispatcher.waitFor(...): Circular dependency detected while ' +
          'waiting for `%s`.',
          id
        );
        continue;
      }
      invariant(
        this.$Dispatcher_callbacks[id],
        'Dispatcher.waitFor(...): `%s` does not map to a registered callback.',
        id
      );
      this.$Dispatcher_invokeCallback(id);
    }
  };

  /**
   * Dispatches a payload to all registered callbacks.
   *
   * @param {object} payload
   */
  Dispatcher.prototype.dispatch=function(payload) {
    invariant(
      !this.$Dispatcher_isDispatching,
      'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.'
    );
    this.$Dispatcher_startDispatching(payload);
    try {
      for (var id in this.$Dispatcher_callbacks) {
        if (this.$Dispatcher_isPending[id]) {
          continue;
        }
        this.$Dispatcher_invokeCallback(id);
      }
    } finally {
      this.$Dispatcher_stopDispatching();
    }
  };

  /**
   * Is this Dispatcher currently dispatching.
   *
   * @return {boolean}
   */
  Dispatcher.prototype.isDispatching=function() {
    return this.$Dispatcher_isDispatching;
  };

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @param {string} id
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_invokeCallback=function(id) {
    this.$Dispatcher_isPending[id] = true;
    this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
    this.$Dispatcher_isHandled[id] = true;
  };

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @param {object} payload
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_startDispatching=function(payload) {
    for (var id in this.$Dispatcher_callbacks) {
      this.$Dispatcher_isPending[id] = false;
      this.$Dispatcher_isHandled[id] = false;
    }
    this.$Dispatcher_pendingPayload = payload;
    this.$Dispatcher_isDispatching = true;
  };

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */
  Dispatcher.prototype.$Dispatcher_stopDispatching=function() {
    this.$Dispatcher_pendingPayload = null;
    this.$Dispatcher_isDispatching = false;
  };


module.exports = Dispatcher;

},{"./invariant":31}],31:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

},{}],32:[function(require,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

"use strict";

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  if (!(obj instanceof Object && !Array.isArray(obj))) {
    throw new Error('keyMirror(...): Argument must be an object.');
  }
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

},{}],33:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],34:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule AutoFocusMixin
 * @typechecks static-only
 */

"use strict";

var focusNode = require("./focusNode");

var AutoFocusMixin = {
  componentDidMount: function() {
    if (this.props.autoFocus) {
      focusNode(this.getDOMNode());
    }
  }
};

module.exports = AutoFocusMixin;

},{"./focusNode":145}],35:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule BeforeInputEventPlugin
 * @typechecks static-only
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPropagators = require("./EventPropagators");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var SyntheticInputEvent = require("./SyntheticInputEvent");

var keyOf = require("./keyOf");

var canUseTextInputEvent = (
  ExecutionEnvironment.canUseDOM &&
  'TextEvent' in window &&
  !('documentMode' in document || isPresto())
);

/**
 * Opera <= 12 includes TextEvent in window, but does not fire
 * text input events. Rely on keypress instead.
 */
function isPresto() {
  var opera = window.opera;
  return (
    typeof opera === 'object' &&
    typeof opera.version === 'function' &&
    parseInt(opera.version(), 10) <= 12
  );
}

var SPACEBAR_CODE = 32;
var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);

var topLevelTypes = EventConstants.topLevelTypes;

// Events and their corresponding property names.
var eventTypes = {
  beforeInput: {
    phasedRegistrationNames: {
      bubbled: keyOf({onBeforeInput: null}),
      captured: keyOf({onBeforeInputCapture: null})
    },
    dependencies: [
      topLevelTypes.topCompositionEnd,
      topLevelTypes.topKeyPress,
      topLevelTypes.topTextInput,
      topLevelTypes.topPaste
    ]
  }
};

// Track characters inserted via keypress and composition events.
var fallbackChars = null;

// Track whether we've ever handled a keypress on the space key.
var hasSpaceKeypress = false;

/**
 * Return whether a native keypress event is assumed to be a command.
 * This is required because Firefox fires `keypress` events for key commands
 * (cut, copy, select-all, etc.) even though no character is inserted.
 */
function isKeypressCommand(nativeEvent) {
  return (
    (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) &&
    // ctrlKey && altKey is equivalent to AltGr, and is not a command.
    !(nativeEvent.ctrlKey && nativeEvent.altKey)
  );
}

/**
 * Create an `onBeforeInput` event to match
 * http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105/#events-inputevents.
 *
 * This event plugin is based on the native `textInput` event
 * available in Chrome, Safari, Opera, and IE. This event fires after
 * `onKeyPress` and `onCompositionEnd`, but before `onInput`.
 *
 * `beforeInput` is spec'd but not implemented in any browsers, and
 * the `input` event does not provide any useful information about what has
 * actually been added, contrary to the spec. Thus, `textInput` is the best
 * available event to identify the characters that have actually been inserted
 * into the target node.
 */
var BeforeInputEventPlugin = {

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {

    var chars;

    if (canUseTextInputEvent) {
      switch (topLevelType) {
        case topLevelTypes.topKeyPress:
          /**
           * If native `textInput` events are available, our goal is to make
           * use of them. However, there is a special case: the spacebar key.
           * In Webkit, preventing default on a spacebar `textInput` event
           * cancels character insertion, but it *also* causes the browser
           * to fall back to its default spacebar behavior of scrolling the
           * page.
           *
           * Tracking at:
           * https://code.google.com/p/chromium/issues/detail?id=355103
           *
           * To avoid this issue, use the keypress event as if no `textInput`
           * event is available.
           */
          var which = nativeEvent.which;
          if (which !== SPACEBAR_CODE) {
            return;
          }

          hasSpaceKeypress = true;
          chars = SPACEBAR_CHAR;
          break;

        case topLevelTypes.topTextInput:
          // Record the characters to be added to the DOM.
          chars = nativeEvent.data;

          // If it's a spacebar character, assume that we have already handled
          // it at the keypress level and bail immediately. Android Chrome
          // doesn't give us keycodes, so we need to blacklist it.
          if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
            return;
          }

          // Otherwise, carry on.
          break;

        default:
          // For other native event types, do nothing.
          return;
      }
    } else {
      switch (topLevelType) {
        case topLevelTypes.topPaste:
          // If a paste event occurs after a keypress, throw out the input
          // chars. Paste events should not lead to BeforeInput events.
          fallbackChars = null;
          break;
        case topLevelTypes.topKeyPress:
          /**
           * As of v27, Firefox may fire keypress events even when no character
           * will be inserted. A few possibilities:
           *
           * - `which` is `0`. Arrow keys, Esc key, etc.
           *
           * - `which` is the pressed key code, but no char is available.
           *   Ex: 'AltGr + d` in Polish. There is no modified character for
           *   this key combination and no character is inserted into the
           *   document, but FF fires the keypress for char code `100` anyway.
           *   No `input` event will occur.
           *
           * - `which` is the pressed key code, but a command combination is
           *   being used. Ex: `Cmd+C`. No character is inserted, and no
           *   `input` event will occur.
           */
          if (nativeEvent.which && !isKeypressCommand(nativeEvent)) {
            fallbackChars = String.fromCharCode(nativeEvent.which);
          }
          break;
        case topLevelTypes.topCompositionEnd:
          fallbackChars = nativeEvent.data;
          break;
      }

      // If no changes have occurred to the fallback string, no relevant
      // event has fired and we're done.
      if (fallbackChars === null) {
        return;
      }

      chars = fallbackChars;
    }

    // If no characters are being inserted, no BeforeInput event should
    // be fired.
    if (!chars) {
      return;
    }

    var event = SyntheticInputEvent.getPooled(
      eventTypes.beforeInput,
      topLevelTargetID,
      nativeEvent
    );

    event.data = chars;
    fallbackChars = null;
    EventPropagators.accumulateTwoPhaseDispatches(event);
    return event;
  }
};

module.exports = BeforeInputEventPlugin;

},{"./EventConstants":48,"./EventPropagators":53,"./ExecutionEnvironment":54,"./SyntheticInputEvent":122,"./keyOf":167}],36:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CSSProperty
 */

"use strict";

/**
 * CSS properties which accept numbers but are not in units of "px".
 */
var isUnitlessNumber = {
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexShrink: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  strokeOpacity: true
};

/**
 * @param {string} prefix vendor-specific prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */
function prefixKey(prefix, key) {
  return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 */
var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
Object.keys(isUnitlessNumber).forEach(function(prop) {
  prefixes.forEach(function(prefix) {
    isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
  });
});

/**
 * Most style properties can be unset by doing .style[prop] = '' but IE8
 * doesn't like doing that with shorthand properties so for the properties that
 * IE8 breaks on, which are listed here, we instead unset each of the
 * individual properties. See http://bugs.jquery.com/ticket/12385.
 * The 4-value 'clock' properties like margin, padding, border-width seem to
 * behave without any problems. Curiously, list-style works too without any
 * special prodding.
 */
var shorthandPropertyExpansions = {
  background: {
    backgroundImage: true,
    backgroundPosition: true,
    backgroundRepeat: true,
    backgroundColor: true
  },
  border: {
    borderWidth: true,
    borderStyle: true,
    borderColor: true
  },
  borderBottom: {
    borderBottomWidth: true,
    borderBottomStyle: true,
    borderBottomColor: true
  },
  borderLeft: {
    borderLeftWidth: true,
    borderLeftStyle: true,
    borderLeftColor: true
  },
  borderRight: {
    borderRightWidth: true,
    borderRightStyle: true,
    borderRightColor: true
  },
  borderTop: {
    borderTopWidth: true,
    borderTopStyle: true,
    borderTopColor: true
  },
  font: {
    fontStyle: true,
    fontVariant: true,
    fontWeight: true,
    fontSize: true,
    lineHeight: true,
    fontFamily: true
  }
};

var CSSProperty = {
  isUnitlessNumber: isUnitlessNumber,
  shorthandPropertyExpansions: shorthandPropertyExpansions
};

module.exports = CSSProperty;

},{}],37:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CSSPropertyOperations
 * @typechecks static-only
 */

"use strict";

var CSSProperty = require("./CSSProperty");
var ExecutionEnvironment = require("./ExecutionEnvironment");

var camelizeStyleName = require("./camelizeStyleName");
var dangerousStyleValue = require("./dangerousStyleValue");
var hyphenateStyleName = require("./hyphenateStyleName");
var memoizeStringOnly = require("./memoizeStringOnly");
var warning = require("./warning");

var processStyleName = memoizeStringOnly(function(styleName) {
  return hyphenateStyleName(styleName);
});

var styleFloatAccessor = 'cssFloat';
if (ExecutionEnvironment.canUseDOM) {
  // IE8 only supports accessing cssFloat (standard) as styleFloat
  if (document.documentElement.style.cssFloat === undefined) {
    styleFloatAccessor = 'styleFloat';
  }
}

if ("production" !== process.env.NODE_ENV) {
  var warnedStyleNames = {};

  var warnHyphenatedStyleName = function(name) {
    if (warnedStyleNames.hasOwnProperty(name) && warnedStyleNames[name]) {
      return;
    }

    warnedStyleNames[name] = true;
    ("production" !== process.env.NODE_ENV ? warning(
      false,
      'Unsupported style property ' + name + '. Did you mean ' +
      camelizeStyleName(name) + '?'
    ) : null);
  };
}

/**
 * Operations for dealing with CSS properties.
 */
var CSSPropertyOperations = {

  /**
   * Serializes a mapping of style properties for use as inline styles:
   *
   *   > createMarkupForStyles({width: '200px', height: 0})
   *   "width:200px;height:0;"
   *
   * Undefined values are ignored so that declarative programming is easier.
   * The result should be HTML-escaped before insertion into the DOM.
   *
   * @param {object} styles
   * @return {?string}
   */
  createMarkupForStyles: function(styles) {
    var serialized = '';
    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      if ("production" !== process.env.NODE_ENV) {
        if (styleName.indexOf('-') > -1) {
          warnHyphenatedStyleName(styleName);
        }
      }
      var styleValue = styles[styleName];
      if (styleValue != null) {
        serialized += processStyleName(styleName) + ':';
        serialized += dangerousStyleValue(styleName, styleValue) + ';';
      }
    }
    return serialized || null;
  },

  /**
   * Sets the value for multiple styles on a node.  If a value is specified as
   * '' (empty string), the corresponding style property will be unset.
   *
   * @param {DOMElement} node
   * @param {object} styles
   */
  setValueForStyles: function(node, styles) {
    var style = node.style;
    for (var styleName in styles) {
      if (!styles.hasOwnProperty(styleName)) {
        continue;
      }
      if ("production" !== process.env.NODE_ENV) {
        if (styleName.indexOf('-') > -1) {
          warnHyphenatedStyleName(styleName);
        }
      }
      var styleValue = dangerousStyleValue(styleName, styles[styleName]);
      if (styleName === 'float') {
        styleName = styleFloatAccessor;
      }
      if (styleValue) {
        style[styleName] = styleValue;
      } else {
        var expansion = CSSProperty.shorthandPropertyExpansions[styleName];
        if (expansion) {
          // Shorthand property that IE8 won't like unsetting, so unset each
          // component to placate it
          for (var individualStyleName in expansion) {
            style[individualStyleName] = '';
          }
        } else {
          style[styleName] = '';
        }
      }
    }
  }

};

module.exports = CSSPropertyOperations;

}).call(this,require('_process'))
},{"./CSSProperty":36,"./ExecutionEnvironment":54,"./camelizeStyleName":133,"./dangerousStyleValue":139,"./hyphenateStyleName":158,"./memoizeStringOnly":169,"./warning":179,"_process":28}],38:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CallbackQueue
 */

"use strict";

var PooledClass = require("./PooledClass");

var assign = require("./Object.assign");
var invariant = require("./invariant");

/**
 * A specialized pseudo-event module to help keep track of components waiting to
 * be notified when their DOM representations are available for use.
 *
 * This implements `PooledClass`, so you should never need to instantiate this.
 * Instead, use `CallbackQueue.getPooled()`.
 *
 * @class ReactMountReady
 * @implements PooledClass
 * @internal
 */
function CallbackQueue() {
  this._callbacks = null;
  this._contexts = null;
}

assign(CallbackQueue.prototype, {

  /**
   * Enqueues a callback to be invoked when `notifyAll` is invoked.
   *
   * @param {function} callback Invoked when `notifyAll` is invoked.
   * @param {?object} context Context to call `callback` with.
   * @internal
   */
  enqueue: function(callback, context) {
    this._callbacks = this._callbacks || [];
    this._contexts = this._contexts || [];
    this._callbacks.push(callback);
    this._contexts.push(context);
  },

  /**
   * Invokes all enqueued callbacks and clears the queue. This is invoked after
   * the DOM representation of a component has been created or updated.
   *
   * @internal
   */
  notifyAll: function() {
    var callbacks = this._callbacks;
    var contexts = this._contexts;
    if (callbacks) {
      ("production" !== process.env.NODE_ENV ? invariant(
        callbacks.length === contexts.length,
        "Mismatched list of contexts in callback queue"
      ) : invariant(callbacks.length === contexts.length));
      this._callbacks = null;
      this._contexts = null;
      for (var i = 0, l = callbacks.length; i < l; i++) {
        callbacks[i].call(contexts[i]);
      }
      callbacks.length = 0;
      contexts.length = 0;
    }
  },

  /**
   * Resets the internal queue.
   *
   * @internal
   */
  reset: function() {
    this._callbacks = null;
    this._contexts = null;
  },

  /**
   * `PooledClass` looks for this.
   */
  destructor: function() {
    this.reset();
  }

});

PooledClass.addPoolingTo(CallbackQueue);

module.exports = CallbackQueue;

}).call(this,require('_process'))
},{"./Object.assign":59,"./PooledClass":60,"./invariant":160,"_process":28}],39:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ChangeEventPlugin
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPluginHub = require("./EventPluginHub");
var EventPropagators = require("./EventPropagators");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var ReactUpdates = require("./ReactUpdates");
var SyntheticEvent = require("./SyntheticEvent");

var isEventSupported = require("./isEventSupported");
var isTextInputElement = require("./isTextInputElement");
var keyOf = require("./keyOf");

var topLevelTypes = EventConstants.topLevelTypes;

var eventTypes = {
  change: {
    phasedRegistrationNames: {
      bubbled: keyOf({onChange: null}),
      captured: keyOf({onChangeCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topChange,
      topLevelTypes.topClick,
      topLevelTypes.topFocus,
      topLevelTypes.topInput,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyUp,
      topLevelTypes.topSelectionChange
    ]
  }
};

/**
 * For IE shims
 */
var activeElement = null;
var activeElementID = null;
var activeElementValue = null;
var activeElementValueProp = null;

/**
 * SECTION: handle `change` event
 */
function shouldUseChangeEvent(elem) {
  return (
    elem.nodeName === 'SELECT' ||
    (elem.nodeName === 'INPUT' && elem.type === 'file')
  );
}

var doesChangeEventBubble = false;
if (ExecutionEnvironment.canUseDOM) {
  // See `handleChange` comment below
  doesChangeEventBubble = isEventSupported('change') && (
    !('documentMode' in document) || document.documentMode > 8
  );
}

function manualDispatchChangeEvent(nativeEvent) {
  var event = SyntheticEvent.getPooled(
    eventTypes.change,
    activeElementID,
    nativeEvent
  );
  EventPropagators.accumulateTwoPhaseDispatches(event);

  // If change and propertychange bubbled, we'd just bind to it like all the
  // other events and have it go through ReactBrowserEventEmitter. Since it
  // doesn't, we manually listen for the events and so we have to enqueue and
  // process the abstract event manually.
  //
  // Batching is necessary here in order to ensure that all event handlers run
  // before the next rerender (including event handlers attached to ancestor
  // elements instead of directly on the input). Without this, controlled
  // components don't work properly in conjunction with event bubbling because
  // the component is rerendered and the value reverted before all the event
  // handlers can run. See https://github.com/facebook/react/issues/708.
  ReactUpdates.batchedUpdates(runEventInBatch, event);
}

function runEventInBatch(event) {
  EventPluginHub.enqueueEvents(event);
  EventPluginHub.processEventQueue();
}

function startWatchingForChangeEventIE8(target, targetID) {
  activeElement = target;
  activeElementID = targetID;
  activeElement.attachEvent('onchange', manualDispatchChangeEvent);
}

function stopWatchingForChangeEventIE8() {
  if (!activeElement) {
    return;
  }
  activeElement.detachEvent('onchange', manualDispatchChangeEvent);
  activeElement = null;
  activeElementID = null;
}

function getTargetIDForChangeEvent(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topChange) {
    return topLevelTargetID;
  }
}
function handleEventsForChangeEventIE8(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topFocus) {
    // stopWatching() should be a noop here but we call it just in case we
    // missed a blur event somehow.
    stopWatchingForChangeEventIE8();
    startWatchingForChangeEventIE8(topLevelTarget, topLevelTargetID);
  } else if (topLevelType === topLevelTypes.topBlur) {
    stopWatchingForChangeEventIE8();
  }
}


/**
 * SECTION: handle `input` event
 */
var isInputEventSupported = false;
if (ExecutionEnvironment.canUseDOM) {
  // IE9 claims to support the input event but fails to trigger it when
  // deleting text, so we ignore its input events
  isInputEventSupported = isEventSupported('input') && (
    !('documentMode' in document) || document.documentMode > 9
  );
}

/**
 * (For old IE.) Replacement getter/setter for the `value` property that gets
 * set on the active element.
 */
var newValueProp =  {
  get: function() {
    return activeElementValueProp.get.call(this);
  },
  set: function(val) {
    // Cast to a string so we can do equality checks.
    activeElementValue = '' + val;
    activeElementValueProp.set.call(this, val);
  }
};

/**
 * (For old IE.) Starts tracking propertychange events on the passed-in element
 * and override the value property so that we can distinguish user events from
 * value changes in JS.
 */
function startWatchingForValueChange(target, targetID) {
  activeElement = target;
  activeElementID = targetID;
  activeElementValue = target.value;
  activeElementValueProp = Object.getOwnPropertyDescriptor(
    target.constructor.prototype,
    'value'
  );

  Object.defineProperty(activeElement, 'value', newValueProp);
  activeElement.attachEvent('onpropertychange', handlePropertyChange);
}

/**
 * (For old IE.) Removes the event listeners from the currently-tracked element,
 * if any exists.
 */
function stopWatchingForValueChange() {
  if (!activeElement) {
    return;
  }

  // delete restores the original property definition
  delete activeElement.value;
  activeElement.detachEvent('onpropertychange', handlePropertyChange);

  activeElement = null;
  activeElementID = null;
  activeElementValue = null;
  activeElementValueProp = null;
}

/**
 * (For old IE.) Handles a propertychange event, sending a `change` event if
 * the value of the active element has changed.
 */
function handlePropertyChange(nativeEvent) {
  if (nativeEvent.propertyName !== 'value') {
    return;
  }
  var value = nativeEvent.srcElement.value;
  if (value === activeElementValue) {
    return;
  }
  activeElementValue = value;

  manualDispatchChangeEvent(nativeEvent);
}

/**
 * If a `change` event should be fired, returns the target's ID.
 */
function getTargetIDForInputEvent(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topInput) {
    // In modern browsers (i.e., not IE8 or IE9), the input event is exactly
    // what we want so fall through here and trigger an abstract event
    return topLevelTargetID;
  }
}

// For IE8 and IE9.
function handleEventsForInputEventIE(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topFocus) {
    // In IE8, we can capture almost all .value changes by adding a
    // propertychange handler and looking for events with propertyName
    // equal to 'value'
    // In IE9, propertychange fires for most input events but is buggy and
    // doesn't fire when text is deleted, but conveniently, selectionchange
    // appears to fire in all of the remaining cases so we catch those and
    // forward the event if the value has changed
    // In either case, we don't want to call the event handler if the value
    // is changed from JS so we redefine a setter for `.value` that updates
    // our activeElementValue variable, allowing us to ignore those changes
    //
    // stopWatching() should be a noop here but we call it just in case we
    // missed a blur event somehow.
    stopWatchingForValueChange();
    startWatchingForValueChange(topLevelTarget, topLevelTargetID);
  } else if (topLevelType === topLevelTypes.topBlur) {
    stopWatchingForValueChange();
  }
}

// For IE8 and IE9.
function getTargetIDForInputEventIE(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topSelectionChange ||
      topLevelType === topLevelTypes.topKeyUp ||
      topLevelType === topLevelTypes.topKeyDown) {
    // On the selectionchange event, the target is just document which isn't
    // helpful for us so just check activeElement instead.
    //
    // 99% of the time, keydown and keyup aren't necessary. IE8 fails to fire
    // propertychange on the first input event after setting `value` from a
    // script and fires only keydown, keypress, keyup. Catching keyup usually
    // gets it and catching keydown lets us fire an event for the first
    // keystroke if user does a key repeat (it'll be a little delayed: right
    // before the second keystroke). Other input methods (e.g., paste) seem to
    // fire selectionchange normally.
    if (activeElement && activeElement.value !== activeElementValue) {
      activeElementValue = activeElement.value;
      return activeElementID;
    }
  }
}


/**
 * SECTION: handle `click` event
 */
function shouldUseClickEvent(elem) {
  // Use the `click` event to detect changes to checkbox and radio inputs.
  // This approach works across all browsers, whereas `change` does not fire
  // until `blur` in IE8.
  return (
    elem.nodeName === 'INPUT' &&
    (elem.type === 'checkbox' || elem.type === 'radio')
  );
}

function getTargetIDForClickEvent(
    topLevelType,
    topLevelTarget,
    topLevelTargetID) {
  if (topLevelType === topLevelTypes.topClick) {
    return topLevelTargetID;
  }
}

/**
 * This plugin creates an `onChange` event that normalizes change events
 * across form elements. This event fires at a time when it's possible to
 * change the element's value without seeing a flicker.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - select
 */
var ChangeEventPlugin = {

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {

    var getTargetIDFunc, handleEventFunc;
    if (shouldUseChangeEvent(topLevelTarget)) {
      if (doesChangeEventBubble) {
        getTargetIDFunc = getTargetIDForChangeEvent;
      } else {
        handleEventFunc = handleEventsForChangeEventIE8;
      }
    } else if (isTextInputElement(topLevelTarget)) {
      if (isInputEventSupported) {
        getTargetIDFunc = getTargetIDForInputEvent;
      } else {
        getTargetIDFunc = getTargetIDForInputEventIE;
        handleEventFunc = handleEventsForInputEventIE;
      }
    } else if (shouldUseClickEvent(topLevelTarget)) {
      getTargetIDFunc = getTargetIDForClickEvent;
    }

    if (getTargetIDFunc) {
      var targetID = getTargetIDFunc(
        topLevelType,
        topLevelTarget,
        topLevelTargetID
      );
      if (targetID) {
        var event = SyntheticEvent.getPooled(
          eventTypes.change,
          targetID,
          nativeEvent
        );
        EventPropagators.accumulateTwoPhaseDispatches(event);
        return event;
      }
    }

    if (handleEventFunc) {
      handleEventFunc(
        topLevelType,
        topLevelTarget,
        topLevelTargetID
      );
    }
  }

};

module.exports = ChangeEventPlugin;

},{"./EventConstants":48,"./EventPluginHub":50,"./EventPropagators":53,"./ExecutionEnvironment":54,"./ReactUpdates":112,"./SyntheticEvent":120,"./isEventSupported":161,"./isTextInputElement":163,"./keyOf":167}],40:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ClientReactRootIndex
 * @typechecks
 */

"use strict";

var nextReactRootIndex = 0;

var ClientReactRootIndex = {
  createReactRootIndex: function() {
    return nextReactRootIndex++;
  }
};

module.exports = ClientReactRootIndex;

},{}],41:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CompositionEventPlugin
 * @typechecks static-only
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPropagators = require("./EventPropagators");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var ReactInputSelection = require("./ReactInputSelection");
var SyntheticCompositionEvent = require("./SyntheticCompositionEvent");

var getTextContentAccessor = require("./getTextContentAccessor");
var keyOf = require("./keyOf");

var END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space
var START_KEYCODE = 229;

var useCompositionEvent = (
  ExecutionEnvironment.canUseDOM &&
  'CompositionEvent' in window
);

// In IE9+, we have access to composition events, but the data supplied
// by the native compositionend event may be incorrect. In Korean, for example,
// the compositionend event contains only one character regardless of
// how many characters have been composed since compositionstart.
// We therefore use the fallback data while still using the native
// events as triggers.
var useFallbackData = (
  !useCompositionEvent ||
  (
    'documentMode' in document &&
    document.documentMode > 8 &&
    document.documentMode <= 11
  )
);

var topLevelTypes = EventConstants.topLevelTypes;
var currentComposition = null;

// Events and their corresponding property names.
var eventTypes = {
  compositionEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCompositionEnd: null}),
      captured: keyOf({onCompositionEndCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topCompositionEnd,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyPress,
      topLevelTypes.topKeyUp,
      topLevelTypes.topMouseDown
    ]
  },
  compositionStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCompositionStart: null}),
      captured: keyOf({onCompositionStartCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topCompositionStart,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyPress,
      topLevelTypes.topKeyUp,
      topLevelTypes.topMouseDown
    ]
  },
  compositionUpdate: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCompositionUpdate: null}),
      captured: keyOf({onCompositionUpdateCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topCompositionUpdate,
      topLevelTypes.topKeyDown,
      topLevelTypes.topKeyPress,
      topLevelTypes.topKeyUp,
      topLevelTypes.topMouseDown
    ]
  }
};

/**
 * Translate native top level events into event types.
 *
 * @param {string} topLevelType
 * @return {object}
 */
function getCompositionEventType(topLevelType) {
  switch (topLevelType) {
    case topLevelTypes.topCompositionStart:
      return eventTypes.compositionStart;
    case topLevelTypes.topCompositionEnd:
      return eventTypes.compositionEnd;
    case topLevelTypes.topCompositionUpdate:
      return eventTypes.compositionUpdate;
  }
}

/**
 * Does our fallback best-guess model think this event signifies that
 * composition has begun?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
function isFallbackStart(topLevelType, nativeEvent) {
  return (
    topLevelType === topLevelTypes.topKeyDown &&
    nativeEvent.keyCode === START_KEYCODE
  );
}

/**
 * Does our fallback mode think that this event is the end of composition?
 *
 * @param {string} topLevelType
 * @param {object} nativeEvent
 * @return {boolean}
 */
function isFallbackEnd(topLevelType, nativeEvent) {
  switch (topLevelType) {
    case topLevelTypes.topKeyUp:
      // Command keys insert or clear IME input.
      return (END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1);
    case topLevelTypes.topKeyDown:
      // Expect IME keyCode on each keydown. If we get any other
      // code we must have exited earlier.
      return (nativeEvent.keyCode !== START_KEYCODE);
    case topLevelTypes.topKeyPress:
    case topLevelTypes.topMouseDown:
    case topLevelTypes.topBlur:
      // Events are not possible without cancelling IME.
      return true;
    default:
      return false;
  }
}

/**
 * Helper class stores information about selection and document state
 * so we can figure out what changed at a later date.
 *
 * @param {DOMEventTarget} root
 */
function FallbackCompositionState(root) {
  this.root = root;
  this.startSelection = ReactInputSelection.getSelection(root);
  this.startValue = this.getText();
}

/**
 * Get current text of input.
 *
 * @return {string}
 */
FallbackCompositionState.prototype.getText = function() {
  return this.root.value || this.root[getTextContentAccessor()];
};

/**
 * Text that has changed since the start of composition.
 *
 * @return {string}
 */
FallbackCompositionState.prototype.getData = function() {
  var endValue = this.getText();
  var prefixLength = this.startSelection.start;
  var suffixLength = this.startValue.length - this.startSelection.end;

  return endValue.substr(
    prefixLength,
    endValue.length - suffixLength - prefixLength
  );
};

/**
 * This plugin creates `onCompositionStart`, `onCompositionUpdate` and
 * `onCompositionEnd` events on inputs, textareas and contentEditable
 * nodes.
 */
var CompositionEventPlugin = {

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {

    var eventType;
    var data;

    if (useCompositionEvent) {
      eventType = getCompositionEventType(topLevelType);
    } else if (!currentComposition) {
      if (isFallbackStart(topLevelType, nativeEvent)) {
        eventType = eventTypes.compositionStart;
      }
    } else if (isFallbackEnd(topLevelType, nativeEvent)) {
      eventType = eventTypes.compositionEnd;
    }

    if (useFallbackData) {
      // The current composition is stored statically and must not be
      // overwritten while composition continues.
      if (!currentComposition && eventType === eventTypes.compositionStart) {
        currentComposition = new FallbackCompositionState(topLevelTarget);
      } else if (eventType === eventTypes.compositionEnd) {
        if (currentComposition) {
          data = currentComposition.getData();
          currentComposition = null;
        }
      }
    }

    if (eventType) {
      var event = SyntheticCompositionEvent.getPooled(
        eventType,
        topLevelTargetID,
        nativeEvent
      );
      if (data) {
        // Inject data generated from fallback path into the synthetic event.
        // This matches the property of native CompositionEventInterface.
        event.data = data;
      }
      EventPropagators.accumulateTwoPhaseDispatches(event);
      return event;
    }
  }
};

module.exports = CompositionEventPlugin;

},{"./EventConstants":48,"./EventPropagators":53,"./ExecutionEnvironment":54,"./ReactInputSelection":92,"./SyntheticCompositionEvent":118,"./getTextContentAccessor":155,"./keyOf":167}],42:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DOMChildrenOperations
 * @typechecks static-only
 */

"use strict";

var Danger = require("./Danger");
var ReactMultiChildUpdateTypes = require("./ReactMultiChildUpdateTypes");

var getTextContentAccessor = require("./getTextContentAccessor");
var invariant = require("./invariant");

/**
 * The DOM property to use when setting text content.
 *
 * @type {string}
 * @private
 */
var textContentAccessor = getTextContentAccessor();

/**
 * Inserts `childNode` as a child of `parentNode` at the `index`.
 *
 * @param {DOMElement} parentNode Parent node in which to insert.
 * @param {DOMElement} childNode Child node to insert.
 * @param {number} index Index at which to insert the child.
 * @internal
 */
function insertChildAt(parentNode, childNode, index) {
  // By exploiting arrays returning `undefined` for an undefined index, we can
  // rely exclusively on `insertBefore(node, null)` instead of also using
  // `appendChild(node)`. However, using `undefined` is not allowed by all
  // browsers so we must replace it with `null`.
  parentNode.insertBefore(
    childNode,
    parentNode.childNodes[index] || null
  );
}

var updateTextContent;
if (textContentAccessor === 'textContent') {
  /**
   * Sets the text content of `node` to `text`.
   *
   * @param {DOMElement} node Node to change
   * @param {string} text New text content
   */
  updateTextContent = function(node, text) {
    node.textContent = text;
  };
} else {
  /**
   * Sets the text content of `node` to `text`.
   *
   * @param {DOMElement} node Node to change
   * @param {string} text New text content
   */
  updateTextContent = function(node, text) {
    // In order to preserve newlines correctly, we can't use .innerText to set
    // the contents (see #1080), so we empty the element then append a text node
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
    if (text) {
      var doc = node.ownerDocument || document;
      node.appendChild(doc.createTextNode(text));
    }
  };
}

/**
 * Operations for updating with DOM children.
 */
var DOMChildrenOperations = {

  dangerouslyReplaceNodeWithMarkup: Danger.dangerouslyReplaceNodeWithMarkup,

  updateTextContent: updateTextContent,

  /**
   * Updates a component's children by processing a series of updates. The
   * update configurations are each expected to have a `parentNode` property.
   *
   * @param {array<object>} updates List of update configurations.
   * @param {array<string>} markupList List of markup strings.
   * @internal
   */
  processUpdates: function(updates, markupList) {
    var update;
    // Mapping from parent IDs to initial child orderings.
    var initialChildren = null;
    // List of children that will be moved or removed.
    var updatedChildren = null;

    for (var i = 0; update = updates[i]; i++) {
      if (update.type === ReactMultiChildUpdateTypes.MOVE_EXISTING ||
          update.type === ReactMultiChildUpdateTypes.REMOVE_NODE) {
        var updatedIndex = update.fromIndex;
        var updatedChild = update.parentNode.childNodes[updatedIndex];
        var parentID = update.parentID;

        ("production" !== process.env.NODE_ENV ? invariant(
          updatedChild,
          'processUpdates(): Unable to find child %s of element. This ' +
          'probably means the DOM was unexpectedly mutated (e.g., by the ' +
          'browser), usually due to forgetting a <tbody> when using tables, ' +
          'nesting tags like <form>, <p>, or <a>, or using non-SVG elements '+
          'in an <svg> parent. Try inspecting the child nodes of the element ' +
          'with React ID `%s`.',
          updatedIndex,
          parentID
        ) : invariant(updatedChild));

        initialChildren = initialChildren || {};
        initialChildren[parentID] = initialChildren[parentID] || [];
        initialChildren[parentID][updatedIndex] = updatedChild;

        updatedChildren = updatedChildren || [];
        updatedChildren.push(updatedChild);
      }
    }

    var renderedMarkup = Danger.dangerouslyRenderMarkup(markupList);

    // Remove updated children first so that `toIndex` is consistent.
    if (updatedChildren) {
      for (var j = 0; j < updatedChildren.length; j++) {
        updatedChildren[j].parentNode.removeChild(updatedChildren[j]);
      }
    }

    for (var k = 0; update = updates[k]; k++) {
      switch (update.type) {
        case ReactMultiChildUpdateTypes.INSERT_MARKUP:
          insertChildAt(
            update.parentNode,
            renderedMarkup[update.markupIndex],
            update.toIndex
          );
          break;
        case ReactMultiChildUpdateTypes.MOVE_EXISTING:
          insertChildAt(
            update.parentNode,
            initialChildren[update.parentID][update.fromIndex],
            update.toIndex
          );
          break;
        case ReactMultiChildUpdateTypes.TEXT_CONTENT:
          updateTextContent(
            update.parentNode,
            update.textContent
          );
          break;
        case ReactMultiChildUpdateTypes.REMOVE_NODE:
          // Already removed by the for-loop above.
          break;
      }
    }
  }

};

module.exports = DOMChildrenOperations;

}).call(this,require('_process'))
},{"./Danger":45,"./ReactMultiChildUpdateTypes":98,"./getTextContentAccessor":155,"./invariant":160,"_process":28}],43:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DOMProperty
 * @typechecks static-only
 */

/*jslint bitwise: true */

"use strict";

var invariant = require("./invariant");

function checkMask(value, bitmask) {
  return (value & bitmask) === bitmask;
}

var DOMPropertyInjection = {
  /**
   * Mapping from normalized, camelcased property names to a configuration that
   * specifies how the associated DOM property should be accessed or rendered.
   */
  MUST_USE_ATTRIBUTE: 0x1,
  MUST_USE_PROPERTY: 0x2,
  HAS_SIDE_EFFECTS: 0x4,
  HAS_BOOLEAN_VALUE: 0x8,
  HAS_NUMERIC_VALUE: 0x10,
  HAS_POSITIVE_NUMERIC_VALUE: 0x20 | 0x10,
  HAS_OVERLOADED_BOOLEAN_VALUE: 0x40,

  /**
   * Inject some specialized knowledge about the DOM. This takes a config object
   * with the following properties:
   *
   * isCustomAttribute: function that given an attribute name will return true
   * if it can be inserted into the DOM verbatim. Useful for data-* or aria-*
   * attributes where it's impossible to enumerate all of the possible
   * attribute names,
   *
   * Properties: object mapping DOM property name to one of the
   * DOMPropertyInjection constants or null. If your attribute isn't in here,
   * it won't get written to the DOM.
   *
   * DOMAttributeNames: object mapping React attribute name to the DOM
   * attribute name. Attribute names not specified use the **lowercase**
   * normalized name.
   *
   * DOMPropertyNames: similar to DOMAttributeNames but for DOM properties.
   * Property names not specified use the normalized name.
   *
   * DOMMutationMethods: Properties that require special mutation methods. If
   * `value` is undefined, the mutation method should unset the property.
   *
   * @param {object} domPropertyConfig the config as described above.
   */
  injectDOMPropertyConfig: function(domPropertyConfig) {
    var Properties = domPropertyConfig.Properties || {};
    var DOMAttributeNames = domPropertyConfig.DOMAttributeNames || {};
    var DOMPropertyNames = domPropertyConfig.DOMPropertyNames || {};
    var DOMMutationMethods = domPropertyConfig.DOMMutationMethods || {};

    if (domPropertyConfig.isCustomAttribute) {
      DOMProperty._isCustomAttributeFunctions.push(
        domPropertyConfig.isCustomAttribute
      );
    }

    for (var propName in Properties) {
      ("production" !== process.env.NODE_ENV ? invariant(
        !DOMProperty.isStandardName.hasOwnProperty(propName),
        'injectDOMPropertyConfig(...): You\'re trying to inject DOM property ' +
        '\'%s\' which has already been injected. You may be accidentally ' +
        'injecting the same DOM property config twice, or you may be ' +
        'injecting two configs that have conflicting property names.',
        propName
      ) : invariant(!DOMProperty.isStandardName.hasOwnProperty(propName)));

      DOMProperty.isStandardName[propName] = true;

      var lowerCased = propName.toLowerCase();
      DOMProperty.getPossibleStandardName[lowerCased] = propName;

      if (DOMAttributeNames.hasOwnProperty(propName)) {
        var attributeName = DOMAttributeNames[propName];
        DOMProperty.getPossibleStandardName[attributeName] = propName;
        DOMProperty.getAttributeName[propName] = attributeName;
      } else {
        DOMProperty.getAttributeName[propName] = lowerCased;
      }

      DOMProperty.getPropertyName[propName] =
        DOMPropertyNames.hasOwnProperty(propName) ?
          DOMPropertyNames[propName] :
          propName;

      if (DOMMutationMethods.hasOwnProperty(propName)) {
        DOMProperty.getMutationMethod[propName] = DOMMutationMethods[propName];
      } else {
        DOMProperty.getMutationMethod[propName] = null;
      }

      var propConfig = Properties[propName];
      DOMProperty.mustUseAttribute[propName] =
        checkMask(propConfig, DOMPropertyInjection.MUST_USE_ATTRIBUTE);
      DOMProperty.mustUseProperty[propName] =
        checkMask(propConfig, DOMPropertyInjection.MUST_USE_PROPERTY);
      DOMProperty.hasSideEffects[propName] =
        checkMask(propConfig, DOMPropertyInjection.HAS_SIDE_EFFECTS);
      DOMProperty.hasBooleanValue[propName] =
        checkMask(propConfig, DOMPropertyInjection.HAS_BOOLEAN_VALUE);
      DOMProperty.hasNumericValue[propName] =
        checkMask(propConfig, DOMPropertyInjection.HAS_NUMERIC_VALUE);
      DOMProperty.hasPositiveNumericValue[propName] =
        checkMask(propConfig, DOMPropertyInjection.HAS_POSITIVE_NUMERIC_VALUE);
      DOMProperty.hasOverloadedBooleanValue[propName] =
        checkMask(propConfig, DOMPropertyInjection.HAS_OVERLOADED_BOOLEAN_VALUE);

      ("production" !== process.env.NODE_ENV ? invariant(
        !DOMProperty.mustUseAttribute[propName] ||
          !DOMProperty.mustUseProperty[propName],
        'DOMProperty: Cannot require using both attribute and property: %s',
        propName
      ) : invariant(!DOMProperty.mustUseAttribute[propName] ||
        !DOMProperty.mustUseProperty[propName]));
      ("production" !== process.env.NODE_ENV ? invariant(
        DOMProperty.mustUseProperty[propName] ||
          !DOMProperty.hasSideEffects[propName],
        'DOMProperty: Properties that have side effects must use property: %s',
        propName
      ) : invariant(DOMProperty.mustUseProperty[propName] ||
        !DOMProperty.hasSideEffects[propName]));
      ("production" !== process.env.NODE_ENV ? invariant(
        !!DOMProperty.hasBooleanValue[propName] +
          !!DOMProperty.hasNumericValue[propName] +
          !!DOMProperty.hasOverloadedBooleanValue[propName] <= 1,
        'DOMProperty: Value can be one of boolean, overloaded boolean, or ' +
        'numeric value, but not a combination: %s',
        propName
      ) : invariant(!!DOMProperty.hasBooleanValue[propName] +
        !!DOMProperty.hasNumericValue[propName] +
        !!DOMProperty.hasOverloadedBooleanValue[propName] <= 1));
    }
  }
};
var defaultValueCache = {};

/**
 * DOMProperty exports lookup objects that can be used like functions:
 *
 *   > DOMProperty.isValid['id']
 *   true
 *   > DOMProperty.isValid['foobar']
 *   undefined
 *
 * Although this may be confusing, it performs better in general.
 *
 * @see http://jsperf.com/key-exists
 * @see http://jsperf.com/key-missing
 */
var DOMProperty = {

  ID_ATTRIBUTE_NAME: 'data-reactid',

  /**
   * Checks whether a property name is a standard property.
   * @type {Object}
   */
  isStandardName: {},

  /**
   * Mapping from lowercase property names to the properly cased version, used
   * to warn in the case of missing properties.
   * @type {Object}
   */
  getPossibleStandardName: {},

  /**
   * Mapping from normalized names to attribute names that differ. Attribute
   * names are used when rendering markup or with `*Attribute()`.
   * @type {Object}
   */
  getAttributeName: {},

  /**
   * Mapping from normalized names to properties on DOM node instances.
   * (This includes properties that mutate due to external factors.)
   * @type {Object}
   */
  getPropertyName: {},

  /**
   * Mapping from normalized names to mutation methods. This will only exist if
   * mutation cannot be set simply by the property or `setAttribute()`.
   * @type {Object}
   */
  getMutationMethod: {},

  /**
   * Whether the property must be accessed and mutated as an object property.
   * @type {Object}
   */
  mustUseAttribute: {},

  /**
   * Whether the property must be accessed and mutated using `*Attribute()`.
   * (This includes anything that fails `<propName> in <element>`.)
   * @type {Object}
   */
  mustUseProperty: {},

  /**
   * Whether or not setting a value causes side effects such as triggering
   * resources to be loaded or text selection changes. We must ensure that
   * the value is only set if it has changed.
   * @type {Object}
   */
  hasSideEffects: {},

  /**
   * Whether the property should be removed when set to a falsey value.
   * @type {Object}
   */
  hasBooleanValue: {},

  /**
   * Whether the property must be numeric or parse as a
   * numeric and should be removed when set to a falsey value.
   * @type {Object}
   */
  hasNumericValue: {},

  /**
   * Whether the property must be positive numeric or parse as a positive
   * numeric and should be removed when set to a falsey value.
   * @type {Object}
   */
  hasPositiveNumericValue: {},

  /**
   * Whether the property can be used as a flag as well as with a value. Removed
   * when strictly equal to false; present without a value when strictly equal
   * to true; present with a value otherwise.
   * @type {Object}
   */
  hasOverloadedBooleanValue: {},

  /**
   * All of the isCustomAttribute() functions that have been injected.
   */
  _isCustomAttributeFunctions: [],

  /**
   * Checks whether a property name is a custom attribute.
   * @method
   */
  isCustomAttribute: function(attributeName) {
    for (var i = 0; i < DOMProperty._isCustomAttributeFunctions.length; i++) {
      var isCustomAttributeFn = DOMProperty._isCustomAttributeFunctions[i];
      if (isCustomAttributeFn(attributeName)) {
        return true;
      }
    }
    return false;
  },

  /**
   * Returns the default property value for a DOM property (i.e., not an
   * attribute). Most default values are '' or false, but not all. Worse yet,
   * some (in particular, `type`) vary depending on the type of element.
   *
   * TODO: Is it better to grab all the possible properties when creating an
   * element to avoid having to create the same element twice?
   */
  getDefaultValueForProperty: function(nodeName, prop) {
    var nodeDefaults = defaultValueCache[nodeName];
    var testElement;
    if (!nodeDefaults) {
      defaultValueCache[nodeName] = nodeDefaults = {};
    }
    if (!(prop in nodeDefaults)) {
      testElement = document.createElement(nodeName);
      nodeDefaults[prop] = testElement[prop];
    }
    return nodeDefaults[prop];
  },

  injection: DOMPropertyInjection
};

module.exports = DOMProperty;

}).call(this,require('_process'))
},{"./invariant":160,"_process":28}],44:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DOMPropertyOperations
 * @typechecks static-only
 */

"use strict";

var DOMProperty = require("./DOMProperty");

var escapeTextForBrowser = require("./escapeTextForBrowser");
var memoizeStringOnly = require("./memoizeStringOnly");
var warning = require("./warning");

function shouldIgnoreValue(name, value) {
  return value == null ||
    (DOMProperty.hasBooleanValue[name] && !value) ||
    (DOMProperty.hasNumericValue[name] && isNaN(value)) ||
    (DOMProperty.hasPositiveNumericValue[name] && (value < 1)) ||
    (DOMProperty.hasOverloadedBooleanValue[name] && value === false);
}

var processAttributeNameAndPrefix = memoizeStringOnly(function(name) {
  return escapeTextForBrowser(name) + '="';
});

if ("production" !== process.env.NODE_ENV) {
  var reactProps = {
    children: true,
    dangerouslySetInnerHTML: true,
    key: true,
    ref: true
  };
  var warnedProperties = {};

  var warnUnknownProperty = function(name) {
    if (reactProps.hasOwnProperty(name) && reactProps[name] ||
        warnedProperties.hasOwnProperty(name) && warnedProperties[name]) {
      return;
    }

    warnedProperties[name] = true;
    var lowerCasedName = name.toLowerCase();

    // data-* attributes should be lowercase; suggest the lowercase version
    var standardName = (
      DOMProperty.isCustomAttribute(lowerCasedName) ?
        lowerCasedName :
      DOMProperty.getPossibleStandardName.hasOwnProperty(lowerCasedName) ?
        DOMProperty.getPossibleStandardName[lowerCasedName] :
        null
    );

    // For now, only warn when we have a suggested correction. This prevents
    // logging too much when using transferPropsTo.
    ("production" !== process.env.NODE_ENV ? warning(
      standardName == null,
      'Unknown DOM property ' + name + '. Did you mean ' + standardName + '?'
    ) : null);

  };
}

/**
 * Operations for dealing with DOM properties.
 */
var DOMPropertyOperations = {

  /**
   * Creates markup for the ID property.
   *
   * @param {string} id Unescaped ID.
   * @return {string} Markup string.
   */
  createMarkupForID: function(id) {
    return processAttributeNameAndPrefix(DOMProperty.ID_ATTRIBUTE_NAME) +
      escapeTextForBrowser(id) + '"';
  },

  /**
   * Creates markup for a property.
   *
   * @param {string} name
   * @param {*} value
   * @return {?string} Markup string, or null if the property was invalid.
   */
  createMarkupForProperty: function(name, value) {
    if (DOMProperty.isStandardName.hasOwnProperty(name) &&
        DOMProperty.isStandardName[name]) {
      if (shouldIgnoreValue(name, value)) {
        return '';
      }
      var attributeName = DOMProperty.getAttributeName[name];
      if (DOMProperty.hasBooleanValue[name] ||
          (DOMProperty.hasOverloadedBooleanValue[name] && value === true)) {
        return escapeTextForBrowser(attributeName);
      }
      return processAttributeNameAndPrefix(attributeName) +
        escapeTextForBrowser(value) + '"';
    } else if (DOMProperty.isCustomAttribute(name)) {
      if (value == null) {
        return '';
      }
      return processAttributeNameAndPrefix(name) +
        escapeTextForBrowser(value) + '"';
    } else if ("production" !== process.env.NODE_ENV) {
      warnUnknownProperty(name);
    }
    return null;
  },

  /**
   * Sets the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   * @param {*} value
   */
  setValueForProperty: function(node, name, value) {
    if (DOMProperty.isStandardName.hasOwnProperty(name) &&
        DOMProperty.isStandardName[name]) {
      var mutationMethod = DOMProperty.getMutationMethod[name];
      if (mutationMethod) {
        mutationMethod(node, value);
      } else if (shouldIgnoreValue(name, value)) {
        this.deleteValueForProperty(node, name);
      } else if (DOMProperty.mustUseAttribute[name]) {
        // `setAttribute` with objects becomes only `[object]` in IE8/9,
        // ('' + value) makes it output the correct toString()-value.
        node.setAttribute(DOMProperty.getAttributeName[name], '' + value);
      } else {
        var propName = DOMProperty.getPropertyName[name];
        // Must explicitly cast values for HAS_SIDE_EFFECTS-properties to the
        // property type before comparing; only `value` does and is string.
        if (!DOMProperty.hasSideEffects[name] ||
            ('' + node[propName]) !== ('' + value)) {
          // Contrary to `setAttribute`, object properties are properly
          // `toString`ed by IE8/9.
          node[propName] = value;
        }
      }
    } else if (DOMProperty.isCustomAttribute(name)) {
      if (value == null) {
        node.removeAttribute(name);
      } else {
        node.setAttribute(name, '' + value);
      }
    } else if ("production" !== process.env.NODE_ENV) {
      warnUnknownProperty(name);
    }
  },

  /**
   * Deletes the value for a property on a node.
   *
   * @param {DOMElement} node
   * @param {string} name
   */
  deleteValueForProperty: function(node, name) {
    if (DOMProperty.isStandardName.hasOwnProperty(name) &&
        DOMProperty.isStandardName[name]) {
      var mutationMethod = DOMProperty.getMutationMethod[name];
      if (mutationMethod) {
        mutationMethod(node, undefined);
      } else if (DOMProperty.mustUseAttribute[name]) {
        node.removeAttribute(DOMProperty.getAttributeName[name]);
      } else {
        var propName = DOMProperty.getPropertyName[name];
        var defaultValue = DOMProperty.getDefaultValueForProperty(
          node.nodeName,
          propName
        );
        if (!DOMProperty.hasSideEffects[name] ||
            ('' + node[propName]) !== defaultValue) {
          node[propName] = defaultValue;
        }
      }
    } else if (DOMProperty.isCustomAttribute(name)) {
      node.removeAttribute(name);
    } else if ("production" !== process.env.NODE_ENV) {
      warnUnknownProperty(name);
    }
  }

};

module.exports = DOMPropertyOperations;

}).call(this,require('_process'))
},{"./DOMProperty":43,"./escapeTextForBrowser":143,"./memoizeStringOnly":169,"./warning":179,"_process":28}],45:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Danger
 * @typechecks static-only
 */

/*jslint evil: true, sub: true */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var createNodesFromMarkup = require("./createNodesFromMarkup");
var emptyFunction = require("./emptyFunction");
var getMarkupWrap = require("./getMarkupWrap");
var invariant = require("./invariant");

var OPEN_TAG_NAME_EXP = /^(<[^ \/>]+)/;
var RESULT_INDEX_ATTR = 'data-danger-index';

/**
 * Extracts the `nodeName` from a string of markup.
 *
 * NOTE: Extracting the `nodeName` does not require a regular expression match
 * because we make assumptions about React-generated markup (i.e. there are no
 * spaces surrounding the opening tag and there is at least one attribute).
 *
 * @param {string} markup String of markup.
 * @return {string} Node name of the supplied markup.
 * @see http://jsperf.com/extract-nodename
 */
function getNodeName(markup) {
  return markup.substring(1, markup.indexOf(' '));
}

var Danger = {

  /**
   * Renders markup into an array of nodes. The markup is expected to render
   * into a list of root nodes. Also, the length of `resultList` and
   * `markupList` should be the same.
   *
   * @param {array<string>} markupList List of markup strings to render.
   * @return {array<DOMElement>} List of rendered nodes.
   * @internal
   */
  dangerouslyRenderMarkup: function(markupList) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ExecutionEnvironment.canUseDOM,
      'dangerouslyRenderMarkup(...): Cannot render markup in a worker ' +
      'thread. Make sure `window` and `document` are available globally ' +
      'before requiring React when unit testing or use ' +
      'React.renderToString for server rendering.'
    ) : invariant(ExecutionEnvironment.canUseDOM));
    var nodeName;
    var markupByNodeName = {};
    // Group markup by `nodeName` if a wrap is necessary, else by '*'.
    for (var i = 0; i < markupList.length; i++) {
      ("production" !== process.env.NODE_ENV ? invariant(
        markupList[i],
        'dangerouslyRenderMarkup(...): Missing markup.'
      ) : invariant(markupList[i]));
      nodeName = getNodeName(markupList[i]);
      nodeName = getMarkupWrap(nodeName) ? nodeName : '*';
      markupByNodeName[nodeName] = markupByNodeName[nodeName] || [];
      markupByNodeName[nodeName][i] = markupList[i];
    }
    var resultList = [];
    var resultListAssignmentCount = 0;
    for (nodeName in markupByNodeName) {
      if (!markupByNodeName.hasOwnProperty(nodeName)) {
        continue;
      }
      var markupListByNodeName = markupByNodeName[nodeName];

      // This for-in loop skips the holes of the sparse array. The order of
      // iteration should follow the order of assignment, which happens to match
      // numerical index order, but we don't rely on that.
      for (var resultIndex in markupListByNodeName) {
        if (markupListByNodeName.hasOwnProperty(resultIndex)) {
          var markup = markupListByNodeName[resultIndex];

          // Push the requested markup with an additional RESULT_INDEX_ATTR
          // attribute.  If the markup does not start with a < character, it
          // will be discarded below (with an appropriate console.error).
          markupListByNodeName[resultIndex] = markup.replace(
            OPEN_TAG_NAME_EXP,
            // This index will be parsed back out below.
            '$1 ' + RESULT_INDEX_ATTR + '="' + resultIndex + '" '
          );
        }
      }

      // Render each group of markup with similar wrapping `nodeName`.
      var renderNodes = createNodesFromMarkup(
        markupListByNodeName.join(''),
        emptyFunction // Do nothing special with <script> tags.
      );

      for (i = 0; i < renderNodes.length; ++i) {
        var renderNode = renderNodes[i];
        if (renderNode.hasAttribute &&
            renderNode.hasAttribute(RESULT_INDEX_ATTR)) {

          resultIndex = +renderNode.getAttribute(RESULT_INDEX_ATTR);
          renderNode.removeAttribute(RESULT_INDEX_ATTR);

          ("production" !== process.env.NODE_ENV ? invariant(
            !resultList.hasOwnProperty(resultIndex),
            'Danger: Assigning to an already-occupied result index.'
          ) : invariant(!resultList.hasOwnProperty(resultIndex)));

          resultList[resultIndex] = renderNode;

          // This should match resultList.length and markupList.length when
          // we're done.
          resultListAssignmentCount += 1;

        } else if ("production" !== process.env.NODE_ENV) {
          console.error(
            "Danger: Discarding unexpected node:",
            renderNode
          );
        }
      }
    }

    // Although resultList was populated out of order, it should now be a dense
    // array.
    ("production" !== process.env.NODE_ENV ? invariant(
      resultListAssignmentCount === resultList.length,
      'Danger: Did not assign to every index of resultList.'
    ) : invariant(resultListAssignmentCount === resultList.length));

    ("production" !== process.env.NODE_ENV ? invariant(
      resultList.length === markupList.length,
      'Danger: Expected markup to render %s nodes, but rendered %s.',
      markupList.length,
      resultList.length
    ) : invariant(resultList.length === markupList.length));

    return resultList;
  },

  /**
   * Replaces a node with a string of markup at its current position within its
   * parent. The markup must render into a single root node.
   *
   * @param {DOMElement} oldChild Child node to replace.
   * @param {string} markup Markup to render in place of the child node.
   * @internal
   */
  dangerouslyReplaceNodeWithMarkup: function(oldChild, markup) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ExecutionEnvironment.canUseDOM,
      'dangerouslyReplaceNodeWithMarkup(...): Cannot render markup in a ' +
      'worker thread. Make sure `window` and `document` are available ' +
      'globally before requiring React when unit testing or use ' +
      'React.renderToString for server rendering.'
    ) : invariant(ExecutionEnvironment.canUseDOM));
    ("production" !== process.env.NODE_ENV ? invariant(markup, 'dangerouslyReplaceNodeWithMarkup(...): Missing markup.') : invariant(markup));
    ("production" !== process.env.NODE_ENV ? invariant(
      oldChild.tagName.toLowerCase() !== 'html',
      'dangerouslyReplaceNodeWithMarkup(...): Cannot replace markup of the ' +
      '<html> node. This is because browser quirks make this unreliable ' +
      'and/or slow. If you want to render to the root you must use ' +
      'server rendering. See renderComponentToString().'
    ) : invariant(oldChild.tagName.toLowerCase() !== 'html'));

    var newChild = createNodesFromMarkup(markup, emptyFunction)[0];
    oldChild.parentNode.replaceChild(newChild, oldChild);
  }

};

module.exports = Danger;

}).call(this,require('_process'))
},{"./ExecutionEnvironment":54,"./createNodesFromMarkup":138,"./emptyFunction":141,"./getMarkupWrap":152,"./invariant":160,"_process":28}],46:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DefaultEventPluginOrder
 */

"use strict";

 var keyOf = require("./keyOf");

/**
 * Module that is injectable into `EventPluginHub`, that specifies a
 * deterministic ordering of `EventPlugin`s. A convenient way to reason about
 * plugins, without having to package every one of them. This is better than
 * having plugins be ordered in the same order that they are injected because
 * that ordering would be influenced by the packaging order.
 * `ResponderEventPlugin` must occur before `SimpleEventPlugin` so that
 * preventing default on events is convenient in `SimpleEventPlugin` handlers.
 */
var DefaultEventPluginOrder = [
  keyOf({ResponderEventPlugin: null}),
  keyOf({SimpleEventPlugin: null}),
  keyOf({TapEventPlugin: null}),
  keyOf({EnterLeaveEventPlugin: null}),
  keyOf({ChangeEventPlugin: null}),
  keyOf({SelectEventPlugin: null}),
  keyOf({CompositionEventPlugin: null}),
  keyOf({BeforeInputEventPlugin: null}),
  keyOf({AnalyticsEventPlugin: null}),
  keyOf({MobileSafariClickEventPlugin: null})
];

module.exports = DefaultEventPluginOrder;

},{"./keyOf":167}],47:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EnterLeaveEventPlugin
 * @typechecks static-only
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPropagators = require("./EventPropagators");
var SyntheticMouseEvent = require("./SyntheticMouseEvent");

var ReactMount = require("./ReactMount");
var keyOf = require("./keyOf");

var topLevelTypes = EventConstants.topLevelTypes;
var getFirstReactDOM = ReactMount.getFirstReactDOM;

var eventTypes = {
  mouseEnter: {
    registrationName: keyOf({onMouseEnter: null}),
    dependencies: [
      topLevelTypes.topMouseOut,
      topLevelTypes.topMouseOver
    ]
  },
  mouseLeave: {
    registrationName: keyOf({onMouseLeave: null}),
    dependencies: [
      topLevelTypes.topMouseOut,
      topLevelTypes.topMouseOver
    ]
  }
};

var extractedEvents = [null, null];

var EnterLeaveEventPlugin = {

  eventTypes: eventTypes,

  /**
   * For almost every interaction we care about, there will be both a top-level
   * `mouseover` and `mouseout` event that occurs. Only use `mouseout` so that
   * we do not extract duplicate events. However, moving the mouse into the
   * browser from outside will not fire a `mouseout` event. In this case, we use
   * the `mouseover` top-level event.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    if (topLevelType === topLevelTypes.topMouseOver &&
        (nativeEvent.relatedTarget || nativeEvent.fromElement)) {
      return null;
    }
    if (topLevelType !== topLevelTypes.topMouseOut &&
        topLevelType !== topLevelTypes.topMouseOver) {
      // Must not be a mouse in or mouse out - ignoring.
      return null;
    }

    var win;
    if (topLevelTarget.window === topLevelTarget) {
      // `topLevelTarget` is probably a window object.
      win = topLevelTarget;
    } else {
      // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
      var doc = topLevelTarget.ownerDocument;
      if (doc) {
        win = doc.defaultView || doc.parentWindow;
      } else {
        win = window;
      }
    }

    var from, to;
    if (topLevelType === topLevelTypes.topMouseOut) {
      from = topLevelTarget;
      to =
        getFirstReactDOM(nativeEvent.relatedTarget || nativeEvent.toElement) ||
        win;
    } else {
      from = win;
      to = topLevelTarget;
    }

    if (from === to) {
      // Nothing pertains to our managed components.
      return null;
    }

    var fromID = from ? ReactMount.getID(from) : '';
    var toID = to ? ReactMount.getID(to) : '';

    var leave = SyntheticMouseEvent.getPooled(
      eventTypes.mouseLeave,
      fromID,
      nativeEvent
    );
    leave.type = 'mouseleave';
    leave.target = from;
    leave.relatedTarget = to;

    var enter = SyntheticMouseEvent.getPooled(
      eventTypes.mouseEnter,
      toID,
      nativeEvent
    );
    enter.type = 'mouseenter';
    enter.target = to;
    enter.relatedTarget = from;

    EventPropagators.accumulateEnterLeaveDispatches(leave, enter, fromID, toID);

    extractedEvents[0] = leave;
    extractedEvents[1] = enter;

    return extractedEvents;
  }

};

module.exports = EnterLeaveEventPlugin;

},{"./EventConstants":48,"./EventPropagators":53,"./ReactMount":96,"./SyntheticMouseEvent":124,"./keyOf":167}],48:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventConstants
 */

"use strict";

var keyMirror = require("./keyMirror");

var PropagationPhases = keyMirror({bubbled: null, captured: null});

/**
 * Types of raw signals from the browser caught at the top level.
 */
var topLevelTypes = keyMirror({
  topBlur: null,
  topChange: null,
  topClick: null,
  topCompositionEnd: null,
  topCompositionStart: null,
  topCompositionUpdate: null,
  topContextMenu: null,
  topCopy: null,
  topCut: null,
  topDoubleClick: null,
  topDrag: null,
  topDragEnd: null,
  topDragEnter: null,
  topDragExit: null,
  topDragLeave: null,
  topDragOver: null,
  topDragStart: null,
  topDrop: null,
  topError: null,
  topFocus: null,
  topInput: null,
  topKeyDown: null,
  topKeyPress: null,
  topKeyUp: null,
  topLoad: null,
  topMouseDown: null,
  topMouseMove: null,
  topMouseOut: null,
  topMouseOver: null,
  topMouseUp: null,
  topPaste: null,
  topReset: null,
  topScroll: null,
  topSelectionChange: null,
  topSubmit: null,
  topTextInput: null,
  topTouchCancel: null,
  topTouchEnd: null,
  topTouchMove: null,
  topTouchStart: null,
  topWheel: null
});

var EventConstants = {
  topLevelTypes: topLevelTypes,
  PropagationPhases: PropagationPhases
};

module.exports = EventConstants;

},{"./keyMirror":166}],49:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventListener
 * @typechecks
 */

var emptyFunction = require("./emptyFunction");

/**
 * Upstream version of event listener. Does not take into account specific
 * nature of platform.
 */
var EventListener = {
  /**
   * Listen to DOM events during the bubble phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  listen: function(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove: function() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, callback);
      return {
        remove: function() {
          target.detachEvent('on' + eventType, callback);
        }
      };
    }
  },

  /**
   * Listen to DOM events during the capture phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  capture: function(target, eventType, callback) {
    if (!target.addEventListener) {
      if ("production" !== process.env.NODE_ENV) {
        console.error(
          'Attempted to listen to events during the capture phase on a ' +
          'browser that does not support the capture phase. Your application ' +
          'will not receive some events.'
        );
      }
      return {
        remove: emptyFunction
      };
    } else {
      target.addEventListener(eventType, callback, true);
      return {
        remove: function() {
          target.removeEventListener(eventType, callback, true);
        }
      };
    }
  },

  registerDefault: function() {}
};

module.exports = EventListener;

}).call(this,require('_process'))
},{"./emptyFunction":141,"_process":28}],50:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventPluginHub
 */

"use strict";

var EventPluginRegistry = require("./EventPluginRegistry");
var EventPluginUtils = require("./EventPluginUtils");

var accumulateInto = require("./accumulateInto");
var forEachAccumulated = require("./forEachAccumulated");
var invariant = require("./invariant");

/**
 * Internal store for event listeners
 */
var listenerBank = {};

/**
 * Internal queue of events that have accumulated their dispatches and are
 * waiting to have their dispatches executed.
 */
var eventQueue = null;

/**
 * Dispatches an event and releases it back into the pool, unless persistent.
 *
 * @param {?object} event Synthetic event to be dispatched.
 * @private
 */
var executeDispatchesAndRelease = function(event) {
  if (event) {
    var executeDispatch = EventPluginUtils.executeDispatch;
    // Plugins can provide custom behavior when dispatching events.
    var PluginModule = EventPluginRegistry.getPluginModuleForEvent(event);
    if (PluginModule && PluginModule.executeDispatch) {
      executeDispatch = PluginModule.executeDispatch;
    }
    EventPluginUtils.executeDispatchesInOrder(event, executeDispatch);

    if (!event.isPersistent()) {
      event.constructor.release(event);
    }
  }
};

/**
 * - `InstanceHandle`: [required] Module that performs logical traversals of DOM
 *   hierarchy given ids of the logical DOM elements involved.
 */
var InstanceHandle = null;

function validateInstanceHandle() {
  var invalid = !InstanceHandle||
    !InstanceHandle.traverseTwoPhase ||
    !InstanceHandle.traverseEnterLeave;
  if (invalid) {
    throw new Error('InstanceHandle not injected before use!');
  }
}

/**
 * This is a unified interface for event plugins to be installed and configured.
 *
 * Event plugins can implement the following properties:
 *
 *   `extractEvents` {function(string, DOMEventTarget, string, object): *}
 *     Required. When a top-level event is fired, this method is expected to
 *     extract synthetic events that will in turn be queued and dispatched.
 *
 *   `eventTypes` {object}
 *     Optional, plugins that fire events must publish a mapping of registration
 *     names that are used to register listeners. Values of this mapping must
 *     be objects that contain `registrationName` or `phasedRegistrationNames`.
 *
 *   `executeDispatch` {function(object, function, string)}
 *     Optional, allows plugins to override how an event gets dispatched. By
 *     default, the listener is simply invoked.
 *
 * Each plugin that is injected into `EventsPluginHub` is immediately operable.
 *
 * @public
 */
var EventPluginHub = {

  /**
   * Methods for injecting dependencies.
   */
  injection: {

    /**
     * @param {object} InjectedMount
     * @public
     */
    injectMount: EventPluginUtils.injection.injectMount,

    /**
     * @param {object} InjectedInstanceHandle
     * @public
     */
    injectInstanceHandle: function(InjectedInstanceHandle) {
      InstanceHandle = InjectedInstanceHandle;
      if ("production" !== process.env.NODE_ENV) {
        validateInstanceHandle();
      }
    },

    getInstanceHandle: function() {
      if ("production" !== process.env.NODE_ENV) {
        validateInstanceHandle();
      }
      return InstanceHandle;
    },

    /**
     * @param {array} InjectedEventPluginOrder
     * @public
     */
    injectEventPluginOrder: EventPluginRegistry.injectEventPluginOrder,

    /**
     * @param {object} injectedNamesToPlugins Map from names to plugin modules.
     */
    injectEventPluginsByName: EventPluginRegistry.injectEventPluginsByName

  },

  eventNameDispatchConfigs: EventPluginRegistry.eventNameDispatchConfigs,

  registrationNameModules: EventPluginRegistry.registrationNameModules,

  /**
   * Stores `listener` at `listenerBank[registrationName][id]`. Is idempotent.
   *
   * @param {string} id ID of the DOM element.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @param {?function} listener The callback to store.
   */
  putListener: function(id, registrationName, listener) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !listener || typeof listener === 'function',
      'Expected %s listener to be a function, instead got type %s',
      registrationName, typeof listener
    ) : invariant(!listener || typeof listener === 'function'));

    var bankForRegistrationName =
      listenerBank[registrationName] || (listenerBank[registrationName] = {});
    bankForRegistrationName[id] = listener;
  },

  /**
   * @param {string} id ID of the DOM element.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @return {?function} The stored callback.
   */
  getListener: function(id, registrationName) {
    var bankForRegistrationName = listenerBank[registrationName];
    return bankForRegistrationName && bankForRegistrationName[id];
  },

  /**
   * Deletes a listener from the registration bank.
   *
   * @param {string} id ID of the DOM element.
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   */
  deleteListener: function(id, registrationName) {
    var bankForRegistrationName = listenerBank[registrationName];
    if (bankForRegistrationName) {
      delete bankForRegistrationName[id];
    }
  },

  /**
   * Deletes all listeners for the DOM element with the supplied ID.
   *
   * @param {string} id ID of the DOM element.
   */
  deleteAllListeners: function(id) {
    for (var registrationName in listenerBank) {
      delete listenerBank[registrationName][id];
    }
  },

  /**
   * Allows registered plugins an opportunity to extract events from top-level
   * native browser events.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @internal
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    var events;
    var plugins = EventPluginRegistry.plugins;
    for (var i = 0, l = plugins.length; i < l; i++) {
      // Not every plugin in the ordering may be loaded at runtime.
      var possiblePlugin = plugins[i];
      if (possiblePlugin) {
        var extractedEvents = possiblePlugin.extractEvents(
          topLevelType,
          topLevelTarget,
          topLevelTargetID,
          nativeEvent
        );
        if (extractedEvents) {
          events = accumulateInto(events, extractedEvents);
        }
      }
    }
    return events;
  },

  /**
   * Enqueues a synthetic event that should be dispatched when
   * `processEventQueue` is invoked.
   *
   * @param {*} events An accumulation of synthetic events.
   * @internal
   */
  enqueueEvents: function(events) {
    if (events) {
      eventQueue = accumulateInto(eventQueue, events);
    }
  },

  /**
   * Dispatches all synthetic events on the event queue.
   *
   * @internal
   */
  processEventQueue: function() {
    // Set `eventQueue` to null before processing it so that we can tell if more
    // events get enqueued while processing.
    var processingEventQueue = eventQueue;
    eventQueue = null;
    forEachAccumulated(processingEventQueue, executeDispatchesAndRelease);
    ("production" !== process.env.NODE_ENV ? invariant(
      !eventQueue,
      'processEventQueue(): Additional events were enqueued while processing ' +
      'an event queue. Support for this has not yet been implemented.'
    ) : invariant(!eventQueue));
  },

  /**
   * These are needed for tests only. Do not use!
   */
  __purge: function() {
    listenerBank = {};
  },

  __getListenerBank: function() {
    return listenerBank;
  }

};

module.exports = EventPluginHub;

}).call(this,require('_process'))
},{"./EventPluginRegistry":51,"./EventPluginUtils":52,"./accumulateInto":130,"./forEachAccumulated":146,"./invariant":160,"_process":28}],51:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventPluginRegistry
 * @typechecks static-only
 */

"use strict";

var invariant = require("./invariant");

/**
 * Injectable ordering of event plugins.
 */
var EventPluginOrder = null;

/**
 * Injectable mapping from names to event plugin modules.
 */
var namesToPlugins = {};

/**
 * Recomputes the plugin list using the injected plugins and plugin ordering.
 *
 * @private
 */
function recomputePluginOrdering() {
  if (!EventPluginOrder) {
    // Wait until an `EventPluginOrder` is injected.
    return;
  }
  for (var pluginName in namesToPlugins) {
    var PluginModule = namesToPlugins[pluginName];
    var pluginIndex = EventPluginOrder.indexOf(pluginName);
    ("production" !== process.env.NODE_ENV ? invariant(
      pluginIndex > -1,
      'EventPluginRegistry: Cannot inject event plugins that do not exist in ' +
      'the plugin ordering, `%s`.',
      pluginName
    ) : invariant(pluginIndex > -1));
    if (EventPluginRegistry.plugins[pluginIndex]) {
      continue;
    }
    ("production" !== process.env.NODE_ENV ? invariant(
      PluginModule.extractEvents,
      'EventPluginRegistry: Event plugins must implement an `extractEvents` ' +
      'method, but `%s` does not.',
      pluginName
    ) : invariant(PluginModule.extractEvents));
    EventPluginRegistry.plugins[pluginIndex] = PluginModule;
    var publishedEvents = PluginModule.eventTypes;
    for (var eventName in publishedEvents) {
      ("production" !== process.env.NODE_ENV ? invariant(
        publishEventForPlugin(
          publishedEvents[eventName],
          PluginModule,
          eventName
        ),
        'EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.',
        eventName,
        pluginName
      ) : invariant(publishEventForPlugin(
        publishedEvents[eventName],
        PluginModule,
        eventName
      )));
    }
  }
}

/**
 * Publishes an event so that it can be dispatched by the supplied plugin.
 *
 * @param {object} dispatchConfig Dispatch configuration for the event.
 * @param {object} PluginModule Plugin publishing the event.
 * @return {boolean} True if the event was successfully published.
 * @private
 */
function publishEventForPlugin(dispatchConfig, PluginModule, eventName) {
  ("production" !== process.env.NODE_ENV ? invariant(
    !EventPluginRegistry.eventNameDispatchConfigs.hasOwnProperty(eventName),
    'EventPluginHub: More than one plugin attempted to publish the same ' +
    'event name, `%s`.',
    eventName
  ) : invariant(!EventPluginRegistry.eventNameDispatchConfigs.hasOwnProperty(eventName)));
  EventPluginRegistry.eventNameDispatchConfigs[eventName] = dispatchConfig;

  var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
  if (phasedRegistrationNames) {
    for (var phaseName in phasedRegistrationNames) {
      if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
        var phasedRegistrationName = phasedRegistrationNames[phaseName];
        publishRegistrationName(
          phasedRegistrationName,
          PluginModule,
          eventName
        );
      }
    }
    return true;
  } else if (dispatchConfig.registrationName) {
    publishRegistrationName(
      dispatchConfig.registrationName,
      PluginModule,
      eventName
    );
    return true;
  }
  return false;
}

/**
 * Publishes a registration name that is used to identify dispatched events and
 * can be used with `EventPluginHub.putListener` to register listeners.
 *
 * @param {string} registrationName Registration name to add.
 * @param {object} PluginModule Plugin publishing the event.
 * @private
 */
function publishRegistrationName(registrationName, PluginModule, eventName) {
  ("production" !== process.env.NODE_ENV ? invariant(
    !EventPluginRegistry.registrationNameModules[registrationName],
    'EventPluginHub: More than one plugin attempted to publish the same ' +
    'registration name, `%s`.',
    registrationName
  ) : invariant(!EventPluginRegistry.registrationNameModules[registrationName]));
  EventPluginRegistry.registrationNameModules[registrationName] = PluginModule;
  EventPluginRegistry.registrationNameDependencies[registrationName] =
    PluginModule.eventTypes[eventName].dependencies;
}

/**
 * Registers plugins so that they can extract and dispatch events.
 *
 * @see {EventPluginHub}
 */
var EventPluginRegistry = {

  /**
   * Ordered list of injected plugins.
   */
  plugins: [],

  /**
   * Mapping from event name to dispatch config
   */
  eventNameDispatchConfigs: {},

  /**
   * Mapping from registration name to plugin module
   */
  registrationNameModules: {},

  /**
   * Mapping from registration name to event name
   */
  registrationNameDependencies: {},

  /**
   * Injects an ordering of plugins (by plugin name). This allows the ordering
   * to be decoupled from injection of the actual plugins so that ordering is
   * always deterministic regardless of packaging, on-the-fly injection, etc.
   *
   * @param {array} InjectedEventPluginOrder
   * @internal
   * @see {EventPluginHub.injection.injectEventPluginOrder}
   */
  injectEventPluginOrder: function(InjectedEventPluginOrder) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !EventPluginOrder,
      'EventPluginRegistry: Cannot inject event plugin ordering more than ' +
      'once. You are likely trying to load more than one copy of React.'
    ) : invariant(!EventPluginOrder));
    // Clone the ordering so it cannot be dynamically mutated.
    EventPluginOrder = Array.prototype.slice.call(InjectedEventPluginOrder);
    recomputePluginOrdering();
  },

  /**
   * Injects plugins to be used by `EventPluginHub`. The plugin names must be
   * in the ordering injected by `injectEventPluginOrder`.
   *
   * Plugins can be injected as part of page initialization or on-the-fly.
   *
   * @param {object} injectedNamesToPlugins Map from names to plugin modules.
   * @internal
   * @see {EventPluginHub.injection.injectEventPluginsByName}
   */
  injectEventPluginsByName: function(injectedNamesToPlugins) {
    var isOrderingDirty = false;
    for (var pluginName in injectedNamesToPlugins) {
      if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
        continue;
      }
      var PluginModule = injectedNamesToPlugins[pluginName];
      if (!namesToPlugins.hasOwnProperty(pluginName) ||
          namesToPlugins[pluginName] !== PluginModule) {
        ("production" !== process.env.NODE_ENV ? invariant(
          !namesToPlugins[pluginName],
          'EventPluginRegistry: Cannot inject two different event plugins ' +
          'using the same name, `%s`.',
          pluginName
        ) : invariant(!namesToPlugins[pluginName]));
        namesToPlugins[pluginName] = PluginModule;
        isOrderingDirty = true;
      }
    }
    if (isOrderingDirty) {
      recomputePluginOrdering();
    }
  },

  /**
   * Looks up the plugin for the supplied event.
   *
   * @param {object} event A synthetic event.
   * @return {?object} The plugin that created the supplied event.
   * @internal
   */
  getPluginModuleForEvent: function(event) {
    var dispatchConfig = event.dispatchConfig;
    if (dispatchConfig.registrationName) {
      return EventPluginRegistry.registrationNameModules[
        dispatchConfig.registrationName
      ] || null;
    }
    for (var phase in dispatchConfig.phasedRegistrationNames) {
      if (!dispatchConfig.phasedRegistrationNames.hasOwnProperty(phase)) {
        continue;
      }
      var PluginModule = EventPluginRegistry.registrationNameModules[
        dispatchConfig.phasedRegistrationNames[phase]
      ];
      if (PluginModule) {
        return PluginModule;
      }
    }
    return null;
  },

  /**
   * Exposed for unit testing.
   * @private
   */
  _resetEventPlugins: function() {
    EventPluginOrder = null;
    for (var pluginName in namesToPlugins) {
      if (namesToPlugins.hasOwnProperty(pluginName)) {
        delete namesToPlugins[pluginName];
      }
    }
    EventPluginRegistry.plugins.length = 0;

    var eventNameDispatchConfigs = EventPluginRegistry.eventNameDispatchConfigs;
    for (var eventName in eventNameDispatchConfigs) {
      if (eventNameDispatchConfigs.hasOwnProperty(eventName)) {
        delete eventNameDispatchConfigs[eventName];
      }
    }

    var registrationNameModules = EventPluginRegistry.registrationNameModules;
    for (var registrationName in registrationNameModules) {
      if (registrationNameModules.hasOwnProperty(registrationName)) {
        delete registrationNameModules[registrationName];
      }
    }
  }

};

module.exports = EventPluginRegistry;

}).call(this,require('_process'))
},{"./invariant":160,"_process":28}],52:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventPluginUtils
 */

"use strict";

var EventConstants = require("./EventConstants");

var invariant = require("./invariant");

/**
 * Injected dependencies:
 */

/**
 * - `Mount`: [required] Module that can convert between React dom IDs and
 *   actual node references.
 */
var injection = {
  Mount: null,
  injectMount: function(InjectedMount) {
    injection.Mount = InjectedMount;
    if ("production" !== process.env.NODE_ENV) {
      ("production" !== process.env.NODE_ENV ? invariant(
        InjectedMount && InjectedMount.getNode,
        'EventPluginUtils.injection.injectMount(...): Injected Mount module ' +
        'is missing getNode.'
      ) : invariant(InjectedMount && InjectedMount.getNode));
    }
  }
};

var topLevelTypes = EventConstants.topLevelTypes;

function isEndish(topLevelType) {
  return topLevelType === topLevelTypes.topMouseUp ||
         topLevelType === topLevelTypes.topTouchEnd ||
         topLevelType === topLevelTypes.topTouchCancel;
}

function isMoveish(topLevelType) {
  return topLevelType === topLevelTypes.topMouseMove ||
         topLevelType === topLevelTypes.topTouchMove;
}
function isStartish(topLevelType) {
  return topLevelType === topLevelTypes.topMouseDown ||
         topLevelType === topLevelTypes.topTouchStart;
}


var validateEventDispatches;
if ("production" !== process.env.NODE_ENV) {
  validateEventDispatches = function(event) {
    var dispatchListeners = event._dispatchListeners;
    var dispatchIDs = event._dispatchIDs;

    var listenersIsArr = Array.isArray(dispatchListeners);
    var idsIsArr = Array.isArray(dispatchIDs);
    var IDsLen = idsIsArr ? dispatchIDs.length : dispatchIDs ? 1 : 0;
    var listenersLen = listenersIsArr ?
      dispatchListeners.length :
      dispatchListeners ? 1 : 0;

    ("production" !== process.env.NODE_ENV ? invariant(
      idsIsArr === listenersIsArr && IDsLen === listenersLen,
      'EventPluginUtils: Invalid `event`.'
    ) : invariant(idsIsArr === listenersIsArr && IDsLen === listenersLen));
  };
}

/**
 * Invokes `cb(event, listener, id)`. Avoids using call if no scope is
 * provided. The `(listener,id)` pair effectively forms the "dispatch" but are
 * kept separate to conserve memory.
 */
function forEachEventDispatch(event, cb) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchIDs = event._dispatchIDs;
  if ("production" !== process.env.NODE_ENV) {
    validateEventDispatches(event);
  }
  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      }
      // Listeners and IDs are two parallel arrays that are always in sync.
      cb(event, dispatchListeners[i], dispatchIDs[i]);
    }
  } else if (dispatchListeners) {
    cb(event, dispatchListeners, dispatchIDs);
  }
}

/**
 * Default implementation of PluginModule.executeDispatch().
 * @param {SyntheticEvent} SyntheticEvent to handle
 * @param {function} Application-level callback
 * @param {string} domID DOM id to pass to the callback.
 */
function executeDispatch(event, listener, domID) {
  event.currentTarget = injection.Mount.getNode(domID);
  var returnValue = listener(event, domID);
  event.currentTarget = null;
  return returnValue;
}

/**
 * Standard/simple iteration through an event's collected dispatches.
 */
function executeDispatchesInOrder(event, executeDispatch) {
  forEachEventDispatch(event, executeDispatch);
  event._dispatchListeners = null;
  event._dispatchIDs = null;
}

/**
 * Standard/simple iteration through an event's collected dispatches, but stops
 * at the first dispatch execution returning true, and returns that id.
 *
 * @return id of the first dispatch execution who's listener returns true, or
 * null if no listener returned true.
 */
function executeDispatchesInOrderStopAtTrueImpl(event) {
  var dispatchListeners = event._dispatchListeners;
  var dispatchIDs = event._dispatchIDs;
  if ("production" !== process.env.NODE_ENV) {
    validateEventDispatches(event);
  }
  if (Array.isArray(dispatchListeners)) {
    for (var i = 0; i < dispatchListeners.length; i++) {
      if (event.isPropagationStopped()) {
        break;
      }
      // Listeners and IDs are two parallel arrays that are always in sync.
      if (dispatchListeners[i](event, dispatchIDs[i])) {
        return dispatchIDs[i];
      }
    }
  } else if (dispatchListeners) {
    if (dispatchListeners(event, dispatchIDs)) {
      return dispatchIDs;
    }
  }
  return null;
}

/**
 * @see executeDispatchesInOrderStopAtTrueImpl
 */
function executeDispatchesInOrderStopAtTrue(event) {
  var ret = executeDispatchesInOrderStopAtTrueImpl(event);
  event._dispatchIDs = null;
  event._dispatchListeners = null;
  return ret;
}

/**
 * Execution of a "direct" dispatch - there must be at most one dispatch
 * accumulated on the event or it is considered an error. It doesn't really make
 * sense for an event with multiple dispatches (bubbled) to keep track of the
 * return values at each dispatch execution, but it does tend to make sense when
 * dealing with "direct" dispatches.
 *
 * @return The return value of executing the single dispatch.
 */
function executeDirectDispatch(event) {
  if ("production" !== process.env.NODE_ENV) {
    validateEventDispatches(event);
  }
  var dispatchListener = event._dispatchListeners;
  var dispatchID = event._dispatchIDs;
  ("production" !== process.env.NODE_ENV ? invariant(
    !Array.isArray(dispatchListener),
    'executeDirectDispatch(...): Invalid `event`.'
  ) : invariant(!Array.isArray(dispatchListener)));
  var res = dispatchListener ?
    dispatchListener(event, dispatchID) :
    null;
  event._dispatchListeners = null;
  event._dispatchIDs = null;
  return res;
}

/**
 * @param {SyntheticEvent} event
 * @return {bool} True iff number of dispatches accumulated is greater than 0.
 */
function hasDispatches(event) {
  return !!event._dispatchListeners;
}

/**
 * General utilities that are useful in creating custom Event Plugins.
 */
var EventPluginUtils = {
  isEndish: isEndish,
  isMoveish: isMoveish,
  isStartish: isStartish,

  executeDirectDispatch: executeDirectDispatch,
  executeDispatch: executeDispatch,
  executeDispatchesInOrder: executeDispatchesInOrder,
  executeDispatchesInOrderStopAtTrue: executeDispatchesInOrderStopAtTrue,
  hasDispatches: hasDispatches,
  injection: injection,
  useTouchEvents: false
};

module.exports = EventPluginUtils;

}).call(this,require('_process'))
},{"./EventConstants":48,"./invariant":160,"_process":28}],53:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule EventPropagators
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPluginHub = require("./EventPluginHub");

var accumulateInto = require("./accumulateInto");
var forEachAccumulated = require("./forEachAccumulated");

var PropagationPhases = EventConstants.PropagationPhases;
var getListener = EventPluginHub.getListener;

/**
 * Some event types have a notion of different registration names for different
 * "phases" of propagation. This finds listeners by a given phase.
 */
function listenerAtPhase(id, event, propagationPhase) {
  var registrationName =
    event.dispatchConfig.phasedRegistrationNames[propagationPhase];
  return getListener(id, registrationName);
}

/**
 * Tags a `SyntheticEvent` with dispatched listeners. Creating this function
 * here, allows us to not have to bind or create functions for each event.
 * Mutating the event's members allows us to not have to create a wrapping
 * "dispatch" object that pairs the event with the listener.
 */
function accumulateDirectionalDispatches(domID, upwards, event) {
  if ("production" !== process.env.NODE_ENV) {
    if (!domID) {
      throw new Error('Dispatching id must not be null');
    }
  }
  var phase = upwards ? PropagationPhases.bubbled : PropagationPhases.captured;
  var listener = listenerAtPhase(domID, event, phase);
  if (listener) {
    event._dispatchListeners =
      accumulateInto(event._dispatchListeners, listener);
    event._dispatchIDs = accumulateInto(event._dispatchIDs, domID);
  }
}

/**
 * Collect dispatches (must be entirely collected before dispatching - see unit
 * tests). Lazily allocate the array to conserve memory.  We must loop through
 * each event and perform the traversal for each one. We can not perform a
 * single traversal for the entire collection of events because each event may
 * have a different target.
 */
function accumulateTwoPhaseDispatchesSingle(event) {
  if (event && event.dispatchConfig.phasedRegistrationNames) {
    EventPluginHub.injection.getInstanceHandle().traverseTwoPhase(
      event.dispatchMarker,
      accumulateDirectionalDispatches,
      event
    );
  }
}


/**
 * Accumulates without regard to direction, does not look for phased
 * registration names. Same as `accumulateDirectDispatchesSingle` but without
 * requiring that the `dispatchMarker` be the same as the dispatched ID.
 */
function accumulateDispatches(id, ignoredDirection, event) {
  if (event && event.dispatchConfig.registrationName) {
    var registrationName = event.dispatchConfig.registrationName;
    var listener = getListener(id, registrationName);
    if (listener) {
      event._dispatchListeners =
        accumulateInto(event._dispatchListeners, listener);
      event._dispatchIDs = accumulateInto(event._dispatchIDs, id);
    }
  }
}

/**
 * Accumulates dispatches on an `SyntheticEvent`, but only for the
 * `dispatchMarker`.
 * @param {SyntheticEvent} event
 */
function accumulateDirectDispatchesSingle(event) {
  if (event && event.dispatchConfig.registrationName) {
    accumulateDispatches(event.dispatchMarker, null, event);
  }
}

function accumulateTwoPhaseDispatches(events) {
  forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle);
}

function accumulateEnterLeaveDispatches(leave, enter, fromID, toID) {
  EventPluginHub.injection.getInstanceHandle().traverseEnterLeave(
    fromID,
    toID,
    accumulateDispatches,
    leave,
    enter
  );
}


function accumulateDirectDispatches(events) {
  forEachAccumulated(events, accumulateDirectDispatchesSingle);
}



/**
 * A small set of propagation patterns, each of which will accept a small amount
 * of information, and generate a set of "dispatch ready event objects" - which
 * are sets of events that have already been annotated with a set of dispatched
 * listener functions/ids. The API is designed this way to discourage these
 * propagation strategies from actually executing the dispatches, since we
 * always want to collect the entire set of dispatches before executing event a
 * single one.
 *
 * @constructor EventPropagators
 */
var EventPropagators = {
  accumulateTwoPhaseDispatches: accumulateTwoPhaseDispatches,
  accumulateDirectDispatches: accumulateDirectDispatches,
  accumulateEnterLeaveDispatches: accumulateEnterLeaveDispatches
};

module.exports = EventPropagators;

}).call(this,require('_process'))
},{"./EventConstants":48,"./EventPluginHub":50,"./accumulateInto":130,"./forEachAccumulated":146,"_process":28}],54:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ExecutionEnvironment
 */

/*jslint evil: true */

"use strict";

var canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

/**
 * Simple, lightweight module assisting with the detection and context of
 * Worker. Helps avoid circular dependencies and allows code to reason about
 * whether or not they are in a Worker, even if they never include the main
 * `ReactWorker` dependency.
 */
var ExecutionEnvironment = {

  canUseDOM: canUseDOM,

  canUseWorkers: typeof Worker !== 'undefined',

  canUseEventListeners:
    canUseDOM && !!(window.addEventListener || window.attachEvent),

  canUseViewport: canUseDOM && !!window.screen,

  isInWorker: !canUseDOM // For now, this is true - might change in the future.

};

module.exports = ExecutionEnvironment;

},{}],55:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule HTMLDOMPropertyConfig
 */

/*jslint bitwise: true*/

"use strict";

var DOMProperty = require("./DOMProperty");
var ExecutionEnvironment = require("./ExecutionEnvironment");

var MUST_USE_ATTRIBUTE = DOMProperty.injection.MUST_USE_ATTRIBUTE;
var MUST_USE_PROPERTY = DOMProperty.injection.MUST_USE_PROPERTY;
var HAS_BOOLEAN_VALUE = DOMProperty.injection.HAS_BOOLEAN_VALUE;
var HAS_SIDE_EFFECTS = DOMProperty.injection.HAS_SIDE_EFFECTS;
var HAS_NUMERIC_VALUE = DOMProperty.injection.HAS_NUMERIC_VALUE;
var HAS_POSITIVE_NUMERIC_VALUE =
  DOMProperty.injection.HAS_POSITIVE_NUMERIC_VALUE;
var HAS_OVERLOADED_BOOLEAN_VALUE =
  DOMProperty.injection.HAS_OVERLOADED_BOOLEAN_VALUE;

var hasSVG;
if (ExecutionEnvironment.canUseDOM) {
  var implementation = document.implementation;
  hasSVG = (
    implementation &&
    implementation.hasFeature &&
    implementation.hasFeature(
      'http://www.w3.org/TR/SVG11/feature#BasicStructure',
      '1.1'
    )
  );
}


var HTMLDOMPropertyConfig = {
  isCustomAttribute: RegExp.prototype.test.bind(
    /^(data|aria)-[a-z_][a-z\d_.\-]*$/
  ),
  Properties: {
    /**
     * Standard Properties
     */
    accept: null,
    acceptCharset: null,
    accessKey: null,
    action: null,
    allowFullScreen: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    allowTransparency: MUST_USE_ATTRIBUTE,
    alt: null,
    async: HAS_BOOLEAN_VALUE,
    autoComplete: null,
    // autoFocus is polyfilled/normalized by AutoFocusMixin
    // autoFocus: HAS_BOOLEAN_VALUE,
    autoPlay: HAS_BOOLEAN_VALUE,
    cellPadding: null,
    cellSpacing: null,
    charSet: MUST_USE_ATTRIBUTE,
    checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    classID: MUST_USE_ATTRIBUTE,
    // To set className on SVG elements, it's necessary to use .setAttribute;
    // this works on HTML elements too in all browsers except IE8. Conveniently,
    // IE8 doesn't support SVG and so we can simply use the attribute in
    // browsers that support SVG and the property in browsers that don't,
    // regardless of whether the element is HTML or SVG.
    className: hasSVG ? MUST_USE_ATTRIBUTE : MUST_USE_PROPERTY,
    cols: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    colSpan: null,
    content: null,
    contentEditable: null,
    contextMenu: MUST_USE_ATTRIBUTE,
    controls: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    coords: null,
    crossOrigin: null,
    data: null, // For `<object />` acts as `src`.
    dateTime: MUST_USE_ATTRIBUTE,
    defer: HAS_BOOLEAN_VALUE,
    dir: null,
    disabled: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    download: HAS_OVERLOADED_BOOLEAN_VALUE,
    draggable: null,
    encType: null,
    form: MUST_USE_ATTRIBUTE,
    formAction: MUST_USE_ATTRIBUTE,
    formEncType: MUST_USE_ATTRIBUTE,
    formMethod: MUST_USE_ATTRIBUTE,
    formNoValidate: HAS_BOOLEAN_VALUE,
    formTarget: MUST_USE_ATTRIBUTE,
    frameBorder: MUST_USE_ATTRIBUTE,
    height: MUST_USE_ATTRIBUTE,
    hidden: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    href: null,
    hrefLang: null,
    htmlFor: null,
    httpEquiv: null,
    icon: null,
    id: MUST_USE_PROPERTY,
    label: null,
    lang: null,
    list: MUST_USE_ATTRIBUTE,
    loop: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    manifest: MUST_USE_ATTRIBUTE,
    marginHeight: null,
    marginWidth: null,
    max: null,
    maxLength: MUST_USE_ATTRIBUTE,
    media: MUST_USE_ATTRIBUTE,
    mediaGroup: null,
    method: null,
    min: null,
    multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    name: null,
    noValidate: HAS_BOOLEAN_VALUE,
    open: null,
    pattern: null,
    placeholder: null,
    poster: null,
    preload: null,
    radioGroup: null,
    readOnly: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    rel: null,
    required: HAS_BOOLEAN_VALUE,
    role: MUST_USE_ATTRIBUTE,
    rows: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    rowSpan: null,
    sandbox: null,
    scope: null,
    scrolling: null,
    seamless: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE,
    selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
    shape: null,
    size: MUST_USE_ATTRIBUTE | HAS_POSITIVE_NUMERIC_VALUE,
    sizes: MUST_USE_ATTRIBUTE,
    span: HAS_POSITIVE_NUMERIC_VALUE,
    spellCheck: null,
    src: null,
    srcDoc: MUST_USE_PROPERTY,
    srcSet: MUST_USE_ATTRIBUTE,
    start: HAS_NUMERIC_VALUE,
    step: null,
    style: null,
    tabIndex: null,
    target: null,
    title: null,
    type: null,
    useMap: null,
    value: MUST_USE_PROPERTY | HAS_SIDE_EFFECTS,
    width: MUST_USE_ATTRIBUTE,
    wmode: MUST_USE_ATTRIBUTE,

    /**
     * Non-standard Properties
     */
    autoCapitalize: null, // Supported in Mobile Safari for keyboard hints
    autoCorrect: null, // Supported in Mobile Safari for keyboard hints
    itemProp: MUST_USE_ATTRIBUTE, // Microdata: http://schema.org/docs/gs.html
    itemScope: MUST_USE_ATTRIBUTE | HAS_BOOLEAN_VALUE, // Microdata: http://schema.org/docs/gs.html
    itemType: MUST_USE_ATTRIBUTE, // Microdata: http://schema.org/docs/gs.html
    property: null // Supports OG in meta tags
  },
  DOMAttributeNames: {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv'
  },
  DOMPropertyNames: {
    autoCapitalize: 'autocapitalize',
    autoComplete: 'autocomplete',
    autoCorrect: 'autocorrect',
    autoFocus: 'autofocus',
    autoPlay: 'autoplay',
    encType: 'enctype',
    hrefLang: 'hreflang',
    radioGroup: 'radiogroup',
    spellCheck: 'spellcheck',
    srcDoc: 'srcdoc',
    srcSet: 'srcset'
  }
};

module.exports = HTMLDOMPropertyConfig;

},{"./DOMProperty":43,"./ExecutionEnvironment":54}],56:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule LinkedValueUtils
 * @typechecks static-only
 */

"use strict";

var ReactPropTypes = require("./ReactPropTypes");

var invariant = require("./invariant");

var hasReadOnlyValue = {
  'button': true,
  'checkbox': true,
  'image': true,
  'hidden': true,
  'radio': true,
  'reset': true,
  'submit': true
};

function _assertSingleLink(input) {
  ("production" !== process.env.NODE_ENV ? invariant(
    input.props.checkedLink == null || input.props.valueLink == null,
    'Cannot provide a checkedLink and a valueLink. If you want to use ' +
    'checkedLink, you probably don\'t want to use valueLink and vice versa.'
  ) : invariant(input.props.checkedLink == null || input.props.valueLink == null));
}
function _assertValueLink(input) {
  _assertSingleLink(input);
  ("production" !== process.env.NODE_ENV ? invariant(
    input.props.value == null && input.props.onChange == null,
    'Cannot provide a valueLink and a value or onChange event. If you want ' +
    'to use value or onChange, you probably don\'t want to use valueLink.'
  ) : invariant(input.props.value == null && input.props.onChange == null));
}

function _assertCheckedLink(input) {
  _assertSingleLink(input);
  ("production" !== process.env.NODE_ENV ? invariant(
    input.props.checked == null && input.props.onChange == null,
    'Cannot provide a checkedLink and a checked property or onChange event. ' +
    'If you want to use checked or onChange, you probably don\'t want to ' +
    'use checkedLink'
  ) : invariant(input.props.checked == null && input.props.onChange == null));
}

/**
 * @param {SyntheticEvent} e change event to handle
 */
function _handleLinkedValueChange(e) {
  /*jshint validthis:true */
  this.props.valueLink.requestChange(e.target.value);
}

/**
  * @param {SyntheticEvent} e change event to handle
  */
function _handleLinkedCheckChange(e) {
  /*jshint validthis:true */
  this.props.checkedLink.requestChange(e.target.checked);
}

/**
 * Provide a linked `value` attribute for controlled forms. You should not use
 * this outside of the ReactDOM controlled form components.
 */
var LinkedValueUtils = {
  Mixin: {
    propTypes: {
      value: function(props, propName, componentName) {
        if (!props[propName] ||
            hasReadOnlyValue[props.type] ||
            props.onChange ||
            props.readOnly ||
            props.disabled) {
          return;
        }
        return new Error(
          'You provided a `value` prop to a form field without an ' +
          '`onChange` handler. This will render a read-only field. If ' +
          'the field should be mutable use `defaultValue`. Otherwise, ' +
          'set either `onChange` or `readOnly`.'
        );
      },
      checked: function(props, propName, componentName) {
        if (!props[propName] ||
            props.onChange ||
            props.readOnly ||
            props.disabled) {
          return;
        }
        return new Error(
          'You provided a `checked` prop to a form field without an ' +
          '`onChange` handler. This will render a read-only field. If ' +
          'the field should be mutable use `defaultChecked`. Otherwise, ' +
          'set either `onChange` or `readOnly`.'
        );
      },
      onChange: ReactPropTypes.func
    }
  },

  /**
   * @param {ReactComponent} input Form component
   * @return {*} current value of the input either from value prop or link.
   */
  getValue: function(input) {
    if (input.props.valueLink) {
      _assertValueLink(input);
      return input.props.valueLink.value;
    }
    return input.props.value;
  },

  /**
   * @param {ReactComponent} input Form component
   * @return {*} current checked status of the input either from checked prop
   *             or link.
   */
  getChecked: function(input) {
    if (input.props.checkedLink) {
      _assertCheckedLink(input);
      return input.props.checkedLink.value;
    }
    return input.props.checked;
  },

  /**
   * @param {ReactComponent} input Form component
   * @return {function} change callback either from onChange prop or link.
   */
  getOnChange: function(input) {
    if (input.props.valueLink) {
      _assertValueLink(input);
      return _handleLinkedValueChange;
    } else if (input.props.checkedLink) {
      _assertCheckedLink(input);
      return _handleLinkedCheckChange;
    }
    return input.props.onChange;
  }
};

module.exports = LinkedValueUtils;

}).call(this,require('_process'))
},{"./ReactPropTypes":105,"./invariant":160,"_process":28}],57:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule LocalEventTrapMixin
 */

"use strict";

var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");

var accumulateInto = require("./accumulateInto");
var forEachAccumulated = require("./forEachAccumulated");
var invariant = require("./invariant");

function remove(event) {
  event.remove();
}

var LocalEventTrapMixin = {
  trapBubbledEvent:function(topLevelType, handlerBaseName) {
    ("production" !== process.env.NODE_ENV ? invariant(this.isMounted(), 'Must be mounted to trap events') : invariant(this.isMounted()));
    var listener = ReactBrowserEventEmitter.trapBubbledEvent(
      topLevelType,
      handlerBaseName,
      this.getDOMNode()
    );
    this._localEventListeners =
      accumulateInto(this._localEventListeners, listener);
  },

  // trapCapturedEvent would look nearly identical. We don't implement that
  // method because it isn't currently needed.

  componentWillUnmount:function() {
    if (this._localEventListeners) {
      forEachAccumulated(this._localEventListeners, remove);
    }
  }
};

module.exports = LocalEventTrapMixin;

}).call(this,require('_process'))
},{"./ReactBrowserEventEmitter":63,"./accumulateInto":130,"./forEachAccumulated":146,"./invariant":160,"_process":28}],58:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule MobileSafariClickEventPlugin
 * @typechecks static-only
 */

"use strict";

var EventConstants = require("./EventConstants");

var emptyFunction = require("./emptyFunction");

var topLevelTypes = EventConstants.topLevelTypes;

/**
 * Mobile Safari does not fire properly bubble click events on non-interactive
 * elements, which means delegated click listeners do not fire. The workaround
 * for this bug involves attaching an empty click listener on the target node.
 *
 * This particular plugin works around the bug by attaching an empty click
 * listener on `touchstart` (which does fire on every element).
 */
var MobileSafariClickEventPlugin = {

  eventTypes: null,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    if (topLevelType === topLevelTypes.topTouchStart) {
      var target = nativeEvent.target;
      if (target && !target.onclick) {
        target.onclick = emptyFunction;
      }
    }
  }

};

module.exports = MobileSafariClickEventPlugin;

},{"./EventConstants":48,"./emptyFunction":141}],59:[function(require,module,exports){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Object.assign
 */

// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.assign

function assign(target, sources) {
  if (target == null) {
    throw new TypeError('Object.assign target cannot be null or undefined');
  }

  var to = Object(target);
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
    var nextSource = arguments[nextIndex];
    if (nextSource == null) {
      continue;
    }

    var from = Object(nextSource);

    // We don't currently support accessors nor proxies. Therefore this
    // copy cannot throw. If we ever supported this then we must handle
    // exceptions and side-effects. We don't support symbols so they won't
    // be transferred.

    for (var key in from) {
      if (hasOwnProperty.call(from, key)) {
        to[key] = from[key];
      }
    }
  }

  return to;
};

module.exports = assign;

},{}],60:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule PooledClass
 */

"use strict";

var invariant = require("./invariant");

/**
 * Static poolers. Several custom versions for each potential number of
 * arguments. A completely generic pooler is easy to implement, but would
 * require accessing the `arguments` object. In each of these, `this` refers to
 * the Class itself, not an instance. If any others are needed, simply add them
 * here, or in their own files.
 */
var oneArgumentPooler = function(copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var twoArgumentPooler = function(a1, a2) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2);
    return instance;
  } else {
    return new Klass(a1, a2);
  }
};

var threeArgumentPooler = function(a1, a2, a3) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3);
    return instance;
  } else {
    return new Klass(a1, a2, a3);
  }
};

var fiveArgumentPooler = function(a1, a2, a3, a4, a5) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4, a5);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4, a5);
  }
};

var standardReleaser = function(instance) {
  var Klass = this;
  ("production" !== process.env.NODE_ENV ? invariant(
    instance instanceof Klass,
    'Trying to release an instance into a pool of a different type.'
  ) : invariant(instance instanceof Klass));
  if (instance.destructor) {
    instance.destructor();
  }
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

/**
 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
 * itself (statically) not adding any prototypical fields. Any CopyConstructor
 * you give this may have a `poolSize` property, and will look for a
 * prototypical `destructor` on instances (optional).
 *
 * @param {Function} CopyConstructor Constructor that can be used to reset.
 * @param {Function} pooler Customizable pooler.
 */
var addPoolingTo = function(CopyConstructor, pooler) {
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var PooledClass = {
  addPoolingTo: addPoolingTo,
  oneArgumentPooler: oneArgumentPooler,
  twoArgumentPooler: twoArgumentPooler,
  threeArgumentPooler: threeArgumentPooler,
  fiveArgumentPooler: fiveArgumentPooler
};

module.exports = PooledClass;

}).call(this,require('_process'))
},{"./invariant":160,"_process":28}],61:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule React
 */

"use strict";

var DOMPropertyOperations = require("./DOMPropertyOperations");
var EventPluginUtils = require("./EventPluginUtils");
var ReactChildren = require("./ReactChildren");
var ReactComponent = require("./ReactComponent");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactContext = require("./ReactContext");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactElement = require("./ReactElement");
var ReactElementValidator = require("./ReactElementValidator");
var ReactDOM = require("./ReactDOM");
var ReactDOMComponent = require("./ReactDOMComponent");
var ReactDefaultInjection = require("./ReactDefaultInjection");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactLegacyElement = require("./ReactLegacyElement");
var ReactMount = require("./ReactMount");
var ReactMultiChild = require("./ReactMultiChild");
var ReactPerf = require("./ReactPerf");
var ReactPropTypes = require("./ReactPropTypes");
var ReactServerRendering = require("./ReactServerRendering");
var ReactTextComponent = require("./ReactTextComponent");

var assign = require("./Object.assign");
var deprecated = require("./deprecated");
var onlyChild = require("./onlyChild");

ReactDefaultInjection.inject();

var createElement = ReactElement.createElement;
var createFactory = ReactElement.createFactory;

if ("production" !== process.env.NODE_ENV) {
  createElement = ReactElementValidator.createElement;
  createFactory = ReactElementValidator.createFactory;
}

// TODO: Drop legacy elements once classes no longer export these factories
createElement = ReactLegacyElement.wrapCreateElement(
  createElement
);
createFactory = ReactLegacyElement.wrapCreateFactory(
  createFactory
);

var render = ReactPerf.measure('React', 'render', ReactMount.render);

var React = {
  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    count: ReactChildren.count,
    only: onlyChild
  },
  DOM: ReactDOM,
  PropTypes: ReactPropTypes,
  initializeTouchEvents: function(shouldUseTouch) {
    EventPluginUtils.useTouchEvents = shouldUseTouch;
  },
  createClass: ReactCompositeComponent.createClass,
  createElement: createElement,
  createFactory: createFactory,
  constructAndRenderComponent: ReactMount.constructAndRenderComponent,
  constructAndRenderComponentByID: ReactMount.constructAndRenderComponentByID,
  render: render,
  renderToString: ReactServerRendering.renderToString,
  renderToStaticMarkup: ReactServerRendering.renderToStaticMarkup,
  unmountComponentAtNode: ReactMount.unmountComponentAtNode,
  isValidClass: ReactLegacyElement.isValidClass,
  isValidElement: ReactElement.isValidElement,
  withContext: ReactContext.withContext,

  // Hook for JSX spread, don't use this for anything else.
  __spread: assign,

  // Deprecations (remove for 0.13)
  renderComponent: deprecated(
    'React',
    'renderComponent',
    'render',
    this,
    render
  ),
  renderComponentToString: deprecated(
    'React',
    'renderComponentToString',
    'renderToString',
    this,
    ReactServerRendering.renderToString
  ),
  renderComponentToStaticMarkup: deprecated(
    'React',
    'renderComponentToStaticMarkup',
    'renderToStaticMarkup',
    this,
    ReactServerRendering.renderToStaticMarkup
  ),
  isValidComponent: deprecated(
    'React',
    'isValidComponent',
    'isValidElement',
    this,
    ReactElement.isValidElement
  )
};

// Inject the runtime into a devtools global hook regardless of browser.
// Allows for debugging when the hook is injected on the page.
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
    Component: ReactComponent,
    CurrentOwner: ReactCurrentOwner,
    DOMComponent: ReactDOMComponent,
    DOMPropertyOperations: DOMPropertyOperations,
    InstanceHandles: ReactInstanceHandles,
    Mount: ReactMount,
    MultiChild: ReactMultiChild,
    TextComponent: ReactTextComponent
  });
}

if ("production" !== process.env.NODE_ENV) {
  var ExecutionEnvironment = require("./ExecutionEnvironment");
  if (ExecutionEnvironment.canUseDOM && window.top === window.self) {

    // If we're in Chrome, look for the devtools marker and provide a download
    // link if not installed.
    if (navigator.userAgent.indexOf('Chrome') > -1) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
        console.debug(
          'Download the React DevTools for a better development experience: ' +
          'http://fb.me/react-devtools'
        );
      }
    }

    var expectedFeatures = [
      // shims
      Array.isArray,
      Array.prototype.every,
      Array.prototype.forEach,
      Array.prototype.indexOf,
      Array.prototype.map,
      Date.now,
      Function.prototype.bind,
      Object.keys,
      String.prototype.split,
      String.prototype.trim,

      // shams
      Object.create,
      Object.freeze
    ];

    for (var i = 0; i < expectedFeatures.length; i++) {
      if (!expectedFeatures[i]) {
        console.error(
          'One or more ES5 shim/shams expected by React are not available: ' +
          'http://fb.me/react-warning-polyfills'
        );
        break;
      }
    }
  }
}

// Version exists only in the open-source version of React, not in Facebook's
// internal version.
React.version = '0.12.2';

module.exports = React;

}).call(this,require('_process'))
},{"./DOMPropertyOperations":44,"./EventPluginUtils":52,"./ExecutionEnvironment":54,"./Object.assign":59,"./ReactChildren":64,"./ReactComponent":65,"./ReactCompositeComponent":67,"./ReactContext":68,"./ReactCurrentOwner":69,"./ReactDOM":70,"./ReactDOMComponent":72,"./ReactDefaultInjection":82,"./ReactElement":85,"./ReactElementValidator":86,"./ReactInstanceHandles":93,"./ReactLegacyElement":94,"./ReactMount":96,"./ReactMultiChild":97,"./ReactPerf":101,"./ReactPropTypes":105,"./ReactServerRendering":109,"./ReactTextComponent":111,"./deprecated":140,"./onlyChild":171,"_process":28}],62:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactBrowserComponentMixin
 */

"use strict";

var ReactEmptyComponent = require("./ReactEmptyComponent");
var ReactMount = require("./ReactMount");

var invariant = require("./invariant");

var ReactBrowserComponentMixin = {
  /**
   * Returns the DOM node rendered by this component.
   *
   * @return {DOMElement} The root node of this component.
   * @final
   * @protected
   */
  getDOMNode: function() {
    ("production" !== process.env.NODE_ENV ? invariant(
      this.isMounted(),
      'getDOMNode(): A component must be mounted to have a DOM node.'
    ) : invariant(this.isMounted()));
    if (ReactEmptyComponent.isNullComponentID(this._rootNodeID)) {
      return null;
    }
    return ReactMount.getNode(this._rootNodeID);
  }
};

module.exports = ReactBrowserComponentMixin;

}).call(this,require('_process'))
},{"./ReactEmptyComponent":87,"./ReactMount":96,"./invariant":160,"_process":28}],63:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactBrowserEventEmitter
 * @typechecks static-only
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPluginHub = require("./EventPluginHub");
var EventPluginRegistry = require("./EventPluginRegistry");
var ReactEventEmitterMixin = require("./ReactEventEmitterMixin");
var ViewportMetrics = require("./ViewportMetrics");

var assign = require("./Object.assign");
var isEventSupported = require("./isEventSupported");

/**
 * Summary of `ReactBrowserEventEmitter` event handling:
 *
 *  - Top-level delegation is used to trap most native browser events. This
 *    may only occur in the main thread and is the responsibility of
 *    ReactEventListener, which is injected and can therefore support pluggable
 *    event sources. This is the only work that occurs in the main thread.
 *
 *  - We normalize and de-duplicate events to account for browser quirks. This
 *    may be done in the worker thread.
 *
 *  - Forward these native events (with the associated top-level type used to
 *    trap it) to `EventPluginHub`, which in turn will ask plugins if they want
 *    to extract any synthetic events.
 *
 *  - The `EventPluginHub` will then process each event by annotating them with
 *    "dispatches", a sequence of listeners and IDs that care about that event.
 *
 *  - The `EventPluginHub` then dispatches the events.
 *
 * Overview of React and the event system:
 *
 * +------------+    .
 * |    DOM     |    .
 * +------------+    .
 *       |           .
 *       v           .
 * +------------+    .
 * | ReactEvent |    .
 * |  Listener  |    .
 * +------------+    .                         +-----------+
 *       |           .               +--------+|SimpleEvent|
 *       |           .               |         |Plugin     |
 * +-----|------+    .               v         +-----------+
 * |     |      |    .    +--------------+                    +------------+
 * |     +-----------.--->|EventPluginHub|                    |    Event   |
 * |            |    .    |              |     +-----------+  | Propagators|
 * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
 * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
 * |            |    .    |              |     +-----------+  |  utilities |
 * |     +-----------.--->|              |                    +------------+
 * |     |      |    .    +--------------+
 * +-----|------+    .                ^        +-----------+
 *       |           .                |        |Enter/Leave|
 *       +           .                +-------+|Plugin     |
 * +-------------+   .                         +-----------+
 * | application |   .
 * |-------------|   .
 * |             |   .
 * |             |   .
 * +-------------+   .
 *                   .
 *    React Core     .  General Purpose Event Plugin System
 */

var alreadyListeningTo = {};
var isMonitoringScrollValue = false;
var reactTopListenersCounter = 0;

// For events like 'submit' which don't consistently bubble (which we trap at a
// lower node than `document`), binding at `document` would cause duplicate
// events so we don't include them here
var topEventMapping = {
  topBlur: 'blur',
  topChange: 'change',
  topClick: 'click',
  topCompositionEnd: 'compositionend',
  topCompositionStart: 'compositionstart',
  topCompositionUpdate: 'compositionupdate',
  topContextMenu: 'contextmenu',
  topCopy: 'copy',
  topCut: 'cut',
  topDoubleClick: 'dblclick',
  topDrag: 'drag',
  topDragEnd: 'dragend',
  topDragEnter: 'dragenter',
  topDragExit: 'dragexit',
  topDragLeave: 'dragleave',
  topDragOver: 'dragover',
  topDragStart: 'dragstart',
  topDrop: 'drop',
  topFocus: 'focus',
  topInput: 'input',
  topKeyDown: 'keydown',
  topKeyPress: 'keypress',
  topKeyUp: 'keyup',
  topMouseDown: 'mousedown',
  topMouseMove: 'mousemove',
  topMouseOut: 'mouseout',
  topMouseOver: 'mouseover',
  topMouseUp: 'mouseup',
  topPaste: 'paste',
  topScroll: 'scroll',
  topSelectionChange: 'selectionchange',
  topTextInput: 'textInput',
  topTouchCancel: 'touchcancel',
  topTouchEnd: 'touchend',
  topTouchMove: 'touchmove',
  topTouchStart: 'touchstart',
  topWheel: 'wheel'
};

/**
 * To ensure no conflicts with other potential React instances on the page
 */
var topListenersIDKey = "_reactListenersID" + String(Math.random()).slice(2);

function getListeningForDocument(mountAt) {
  // In IE8, `mountAt` is a host object and doesn't have `hasOwnProperty`
  // directly.
  if (!Object.prototype.hasOwnProperty.call(mountAt, topListenersIDKey)) {
    mountAt[topListenersIDKey] = reactTopListenersCounter++;
    alreadyListeningTo[mountAt[topListenersIDKey]] = {};
  }
  return alreadyListeningTo[mountAt[topListenersIDKey]];
}

/**
 * `ReactBrowserEventEmitter` is used to attach top-level event listeners. For
 * example:
 *
 *   ReactBrowserEventEmitter.putListener('myID', 'onClick', myFunction);
 *
 * This would allocate a "registration" of `('onClick', myFunction)` on 'myID'.
 *
 * @internal
 */
var ReactBrowserEventEmitter = assign({}, ReactEventEmitterMixin, {

  /**
   * Injectable event backend
   */
  ReactEventListener: null,

  injection: {
    /**
     * @param {object} ReactEventListener
     */
    injectReactEventListener: function(ReactEventListener) {
      ReactEventListener.setHandleTopLevel(
        ReactBrowserEventEmitter.handleTopLevel
      );
      ReactBrowserEventEmitter.ReactEventListener = ReactEventListener;
    }
  },

  /**
   * Sets whether or not any created callbacks should be enabled.
   *
   * @param {boolean} enabled True if callbacks should be enabled.
   */
  setEnabled: function(enabled) {
    if (ReactBrowserEventEmitter.ReactEventListener) {
      ReactBrowserEventEmitter.ReactEventListener.setEnabled(enabled);
    }
  },

  /**
   * @return {boolean} True if callbacks are enabled.
   */
  isEnabled: function() {
    return !!(
      ReactBrowserEventEmitter.ReactEventListener &&
      ReactBrowserEventEmitter.ReactEventListener.isEnabled()
    );
  },

  /**
   * We listen for bubbled touch events on the document object.
   *
   * Firefox v8.01 (and possibly others) exhibited strange behavior when
   * mounting `onmousemove` events at some node that was not the document
   * element. The symptoms were that if your mouse is not moving over something
   * contained within that mount point (for example on the background) the
   * top-level listeners for `onmousemove` won't be called. However, if you
   * register the `mousemove` on the document object, then it will of course
   * catch all `mousemove`s. This along with iOS quirks, justifies restricting
   * top-level listeners to the document object only, at least for these
   * movement types of events and possibly all events.
   *
   * @see http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
   *
   * Also, `keyup`/`keypress`/`keydown` do not bubble to the window on IE, but
   * they bubble to document.
   *
   * @param {string} registrationName Name of listener (e.g. `onClick`).
   * @param {object} contentDocumentHandle Document which owns the container
   */
  listenTo: function(registrationName, contentDocumentHandle) {
    var mountAt = contentDocumentHandle;
    var isListening = getListeningForDocument(mountAt);
    var dependencies = EventPluginRegistry.
      registrationNameDependencies[registrationName];

    var topLevelTypes = EventConstants.topLevelTypes;
    for (var i = 0, l = dependencies.length; i < l; i++) {
      var dependency = dependencies[i];
      if (!(
            isListening.hasOwnProperty(dependency) &&
            isListening[dependency]
          )) {
        if (dependency === topLevelTypes.topWheel) {
          if (isEventSupported('wheel')) {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topWheel,
              'wheel',
              mountAt
            );
          } else if (isEventSupported('mousewheel')) {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topWheel,
              'mousewheel',
              mountAt
            );
          } else {
            // Firefox needs to capture a different mouse scroll event.
            // @see http://www.quirksmode.org/dom/events/tests/scroll.html
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topWheel,
              'DOMMouseScroll',
              mountAt
            );
          }
        } else if (dependency === topLevelTypes.topScroll) {

          if (isEventSupported('scroll', true)) {
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(
              topLevelTypes.topScroll,
              'scroll',
              mountAt
            );
          } else {
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topScroll,
              'scroll',
              ReactBrowserEventEmitter.ReactEventListener.WINDOW_HANDLE
            );
          }
        } else if (dependency === topLevelTypes.topFocus ||
            dependency === topLevelTypes.topBlur) {

          if (isEventSupported('focus', true)) {
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(
              topLevelTypes.topFocus,
              'focus',
              mountAt
            );
            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(
              topLevelTypes.topBlur,
              'blur',
              mountAt
            );
          } else if (isEventSupported('focusin')) {
            // IE has `focusin` and `focusout` events which bubble.
            // @see http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topFocus,
              'focusin',
              mountAt
            );
            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
              topLevelTypes.topBlur,
              'focusout',
              mountAt
            );
          }

          // to make sure blur and focus event listeners are only attached once
          isListening[topLevelTypes.topBlur] = true;
          isListening[topLevelTypes.topFocus] = true;
        } else if (topEventMapping.hasOwnProperty(dependency)) {
          ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
            dependency,
            topEventMapping[dependency],
            mountAt
          );
        }

        isListening[dependency] = true;
      }
    }
  },

  trapBubbledEvent: function(topLevelType, handlerBaseName, handle) {
    return ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(
      topLevelType,
      handlerBaseName,
      handle
    );
  },

  trapCapturedEvent: function(topLevelType, handlerBaseName, handle) {
    return ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(
      topLevelType,
      handlerBaseName,
      handle
    );
  },

  /**
   * Listens to window scroll and resize events. We cache scroll values so that
   * application code can access them without triggering reflows.
   *
   * NOTE: Scroll events do not bubble.
   *
   * @see http://www.quirksmode.org/dom/events/scroll.html
   */
  ensureScrollValueMonitoring: function(){
    if (!isMonitoringScrollValue) {
      var refresh = ViewportMetrics.refreshScrollValues;
      ReactBrowserEventEmitter.ReactEventListener.monitorScrollValue(refresh);
      isMonitoringScrollValue = true;
    }
  },

  eventNameDispatchConfigs: EventPluginHub.eventNameDispatchConfigs,

  registrationNameModules: EventPluginHub.registrationNameModules,

  putListener: EventPluginHub.putListener,

  getListener: EventPluginHub.getListener,

  deleteListener: EventPluginHub.deleteListener,

  deleteAllListeners: EventPluginHub.deleteAllListeners

});

module.exports = ReactBrowserEventEmitter;

},{"./EventConstants":48,"./EventPluginHub":50,"./EventPluginRegistry":51,"./Object.assign":59,"./ReactEventEmitterMixin":89,"./ViewportMetrics":129,"./isEventSupported":161}],64:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactChildren
 */

"use strict";

var PooledClass = require("./PooledClass");

var traverseAllChildren = require("./traverseAllChildren");
var warning = require("./warning");

var twoArgumentPooler = PooledClass.twoArgumentPooler;
var threeArgumentPooler = PooledClass.threeArgumentPooler;

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * traversal. Allows avoiding binding callbacks.
 *
 * @constructor ForEachBookKeeping
 * @param {!function} forEachFunction Function to perform traversal with.
 * @param {?*} forEachContext Context to perform context with.
 */
function ForEachBookKeeping(forEachFunction, forEachContext) {
  this.forEachFunction = forEachFunction;
  this.forEachContext = forEachContext;
}
PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

function forEachSingleChild(traverseContext, child, name, i) {
  var forEachBookKeeping = traverseContext;
  forEachBookKeeping.forEachFunction.call(
    forEachBookKeeping.forEachContext, child, i);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc.
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }

  var traverseContext =
    ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  ForEachBookKeeping.release(traverseContext);
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * mapping. Allows avoiding binding callbacks.
 *
 * @constructor MapBookKeeping
 * @param {!*} mapResult Object containing the ordered map of results.
 * @param {!function} mapFunction Function to perform mapping with.
 * @param {?*} mapContext Context to perform mapping with.
 */
function MapBookKeeping(mapResult, mapFunction, mapContext) {
  this.mapResult = mapResult;
  this.mapFunction = mapFunction;
  this.mapContext = mapContext;
}
PooledClass.addPoolingTo(MapBookKeeping, threeArgumentPooler);

function mapSingleChildIntoContext(traverseContext, child, name, i) {
  var mapBookKeeping = traverseContext;
  var mapResult = mapBookKeeping.mapResult;

  var keyUnique = !mapResult.hasOwnProperty(name);
  ("production" !== process.env.NODE_ENV ? warning(
    keyUnique,
    'ReactChildren.map(...): Encountered two children with the same key, ' +
    '`%s`. Child keys must be unique; when two children share a key, only ' +
    'the first child will be used.',
    name
  ) : null);

  if (keyUnique) {
    var mappedChild =
      mapBookKeeping.mapFunction.call(mapBookKeeping.mapContext, child, i);
    mapResult[name] = mappedChild;
  }
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * TODO: This may likely break any calls to `ReactChildren.map` that were
 * previously relying on the fact that we guarded against null children.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} mapFunction.
 * @param {*} mapContext Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }

  var mapResult = {};
  var traverseContext = MapBookKeeping.getPooled(mapResult, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
  return mapResult;
}

function forEachSingleChildDummy(traverseContext, child, name, i) {
  return null;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children, context) {
  return traverseAllChildren(children, forEachSingleChildDummy, null);
}

var ReactChildren = {
  forEach: forEachChildren,
  map: mapChildren,
  count: countChildren
};

module.exports = ReactChildren;

}).call(this,require('_process'))
},{"./PooledClass":60,"./traverseAllChildren":178,"./warning":179,"_process":28}],65:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactComponent
 */

"use strict";

var ReactElement = require("./ReactElement");
var ReactOwner = require("./ReactOwner");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");
var invariant = require("./invariant");
var keyMirror = require("./keyMirror");

/**
 * Every React component is in one of these life cycles.
 */
var ComponentLifeCycle = keyMirror({
  /**
   * Mounted components have a DOM node representation and are capable of
   * receiving new props.
   */
  MOUNTED: null,
  /**
   * Unmounted components are inactive and cannot receive new props.
   */
  UNMOUNTED: null
});

var injected = false;

/**
 * Optionally injectable environment dependent cleanup hook. (server vs.
 * browser etc). Example: A browser system caches DOM nodes based on component
 * ID and must remove that cache entry when this instance is unmounted.
 *
 * @private
 */
var unmountIDFromEnvironment = null;

/**
 * The "image" of a component tree, is the platform specific (typically
 * serialized) data that represents a tree of lower level UI building blocks.
 * On the web, this "image" is HTML markup which describes a construction of
 * low level `div` and `span` nodes. Other platforms may have different
 * encoding of this "image". This must be injected.
 *
 * @private
 */
var mountImageIntoNode = null;

/**
 * Components are the basic units of composition in React.
 *
 * Every component accepts a set of keyed input parameters known as "props" that
 * are initialized by the constructor. Once a component is mounted, the props
 * can be mutated using `setProps` or `replaceProps`.
 *
 * Every component is capable of the following operations:
 *
 *   `mountComponent`
 *     Initializes the component, renders markup, and registers event listeners.
 *
 *   `receiveComponent`
 *     Updates the rendered DOM nodes to match the given component.
 *
 *   `unmountComponent`
 *     Releases any resources allocated by this component.
 *
 * Components can also be "owned" by other components. Being owned by another
 * component means being constructed by that component. This is different from
 * being the child of a component, which means having a DOM representation that
 * is a child of the DOM representation of that component.
 *
 * @class ReactComponent
 */
var ReactComponent = {

  injection: {
    injectEnvironment: function(ReactComponentEnvironment) {
      ("production" !== process.env.NODE_ENV ? invariant(
        !injected,
        'ReactComponent: injectEnvironment() can only be called once.'
      ) : invariant(!injected));
      mountImageIntoNode = ReactComponentEnvironment.mountImageIntoNode;
      unmountIDFromEnvironment =
        ReactComponentEnvironment.unmountIDFromEnvironment;
      ReactComponent.BackendIDOperations =
        ReactComponentEnvironment.BackendIDOperations;
      injected = true;
    }
  },

  /**
   * @internal
   */
  LifeCycle: ComponentLifeCycle,

  /**
   * Injected module that provides ability to mutate individual properties.
   * Injected into the base class because many different subclasses need access
   * to this.
   *
   * @internal
   */
  BackendIDOperations: null,

  /**
   * Base functionality for every ReactComponent constructor. Mixed into the
   * `ReactComponent` prototype, but exposed statically for easy access.
   *
   * @lends {ReactComponent.prototype}
   */
  Mixin: {

    /**
     * Checks whether or not this component is mounted.
     *
     * @return {boolean} True if mounted, false otherwise.
     * @final
     * @protected
     */
    isMounted: function() {
      return this._lifeCycleState === ComponentLifeCycle.MOUNTED;
    },

    /**
     * Sets a subset of the props.
     *
     * @param {object} partialProps Subset of the next props.
     * @param {?function} callback Called after props are updated.
     * @final
     * @public
     */
    setProps: function(partialProps, callback) {
      // Merge with the pending element if it exists, otherwise with existing
      // element props.
      var element = this._pendingElement || this._currentElement;
      this.replaceProps(
        assign({}, element.props, partialProps),
        callback
      );
    },

    /**
     * Replaces all of the props.
     *
     * @param {object} props New props.
     * @param {?function} callback Called after props are updated.
     * @final
     * @public
     */
    replaceProps: function(props, callback) {
      ("production" !== process.env.NODE_ENV ? invariant(
        this.isMounted(),
        'replaceProps(...): Can only update a mounted component.'
      ) : invariant(this.isMounted()));
      ("production" !== process.env.NODE_ENV ? invariant(
        this._mountDepth === 0,
        'replaceProps(...): You called `setProps` or `replaceProps` on a ' +
        'component with a parent. This is an anti-pattern since props will ' +
        'get reactively updated when rendered. Instead, change the owner\'s ' +
        '`render` method to pass the correct value as props to the component ' +
        'where it is created.'
      ) : invariant(this._mountDepth === 0));
      // This is a deoptimized path. We optimize for always having a element.
      // This creates an extra internal element.
      this._pendingElement = ReactElement.cloneAndReplaceProps(
        this._pendingElement || this._currentElement,
        props
      );
      ReactUpdates.enqueueUpdate(this, callback);
    },

    /**
     * Schedule a partial update to the props. Only used for internal testing.
     *
     * @param {object} partialProps Subset of the next props.
     * @param {?function} callback Called after props are updated.
     * @final
     * @internal
     */
    _setPropsInternal: function(partialProps, callback) {
      // This is a deoptimized path. We optimize for always having a element.
      // This creates an extra internal element.
      var element = this._pendingElement || this._currentElement;
      this._pendingElement = ReactElement.cloneAndReplaceProps(
        element,
        assign({}, element.props, partialProps)
      );
      ReactUpdates.enqueueUpdate(this, callback);
    },

    /**
     * Base constructor for all React components.
     *
     * Subclasses that override this method should make sure to invoke
     * `ReactComponent.Mixin.construct.call(this, ...)`.
     *
     * @param {ReactElement} element
     * @internal
     */
    construct: function(element) {
      // This is the public exposed props object after it has been processed
      // with default props. The element's props represents the true internal
      // state of the props.
      this.props = element.props;
      // Record the component responsible for creating this component.
      // This is accessible through the element but we maintain an extra
      // field for compatibility with devtools and as a way to make an
      // incremental update. TODO: Consider deprecating this field.
      this._owner = element._owner;

      // All components start unmounted.
      this._lifeCycleState = ComponentLifeCycle.UNMOUNTED;

      // See ReactUpdates.
      this._pendingCallbacks = null;

      // We keep the old element and a reference to the pending element
      // to track updates.
      this._currentElement = element;
      this._pendingElement = null;
    },

    /**
     * Initializes the component, renders markup, and registers event listeners.
     *
     * NOTE: This does not insert any nodes into the DOM.
     *
     * Subclasses that override this method should make sure to invoke
     * `ReactComponent.Mixin.mountComponent.call(this, ...)`.
     *
     * @param {string} rootID DOM ID of the root node.
     * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
     * @param {number} mountDepth number of components in the owner hierarchy.
     * @return {?string} Rendered markup to be inserted into the DOM.
     * @internal
     */
    mountComponent: function(rootID, transaction, mountDepth) {
      ("production" !== process.env.NODE_ENV ? invariant(
        !this.isMounted(),
        'mountComponent(%s, ...): Can only mount an unmounted component. ' +
        'Make sure to avoid storing components between renders or reusing a ' +
        'single component instance in multiple places.',
        rootID
      ) : invariant(!this.isMounted()));
      var ref = this._currentElement.ref;
      if (ref != null) {
        var owner = this._currentElement._owner;
        ReactOwner.addComponentAsRefTo(this, ref, owner);
      }
      this._rootNodeID = rootID;
      this._lifeCycleState = ComponentLifeCycle.MOUNTED;
      this._mountDepth = mountDepth;
      // Effectively: return '';
    },

    /**
     * Releases any resources allocated by `mountComponent`.
     *
     * NOTE: This does not remove any nodes from the DOM.
     *
     * Subclasses that override this method should make sure to invoke
     * `ReactComponent.Mixin.unmountComponent.call(this)`.
     *
     * @internal
     */
    unmountComponent: function() {
      ("production" !== process.env.NODE_ENV ? invariant(
        this.isMounted(),
        'unmountComponent(): Can only unmount a mounted component.'
      ) : invariant(this.isMounted()));
      var ref = this._currentElement.ref;
      if (ref != null) {
        ReactOwner.removeComponentAsRefFrom(this, ref, this._owner);
      }
      unmountIDFromEnvironment(this._rootNodeID);
      this._rootNodeID = null;
      this._lifeCycleState = ComponentLifeCycle.UNMOUNTED;
    },

    /**
     * Given a new instance of this component, updates the rendered DOM nodes
     * as if that instance was rendered instead.
     *
     * Subclasses that override this method should make sure to invoke
     * `ReactComponent.Mixin.receiveComponent.call(this, ...)`.
     *
     * @param {object} nextComponent Next set of properties.
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    receiveComponent: function(nextElement, transaction) {
      ("production" !== process.env.NODE_ENV ? invariant(
        this.isMounted(),
        'receiveComponent(...): Can only update a mounted component.'
      ) : invariant(this.isMounted()));
      this._pendingElement = nextElement;
      this.performUpdateIfNecessary(transaction);
    },

    /**
     * If `_pendingElement` is set, update the component.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    performUpdateIfNecessary: function(transaction) {
      if (this._pendingElement == null) {
        return;
      }
      var prevElement = this._currentElement;
      var nextElement = this._pendingElement;
      this._currentElement = nextElement;
      this.props = nextElement.props;
      this._owner = nextElement._owner;
      this._pendingElement = null;
      this.updateComponent(transaction, prevElement);
    },

    /**
     * Updates the component's currently mounted representation.
     *
     * @param {ReactReconcileTransaction} transaction
     * @param {object} prevElement
     * @internal
     */
    updateComponent: function(transaction, prevElement) {
      var nextElement = this._currentElement;

      // If either the owner or a `ref` has changed, make sure the newest owner
      // has stored a reference to `this`, and the previous owner (if different)
      // has forgotten the reference to `this`. We use the element instead
      // of the public this.props because the post processing cannot determine
      // a ref. The ref conceptually lives on the element.

      // TODO: Should this even be possible? The owner cannot change because
      // it's forbidden by shouldUpdateReactComponent. The ref can change
      // if you swap the keys of but not the refs. Reconsider where this check
      // is made. It probably belongs where the key checking and
      // instantiateReactComponent is done.

      if (nextElement._owner !== prevElement._owner ||
          nextElement.ref !== prevElement.ref) {
        if (prevElement.ref != null) {
          ReactOwner.removeComponentAsRefFrom(
            this, prevElement.ref, prevElement._owner
          );
        }
        // Correct, even if the owner is the same, and only the ref has changed.
        if (nextElement.ref != null) {
          ReactOwner.addComponentAsRefTo(
            this,
            nextElement.ref,
            nextElement._owner
          );
        }
      }
    },

    /**
     * Mounts this component and inserts it into the DOM.
     *
     * @param {string} rootID DOM ID of the root node.
     * @param {DOMElement} container DOM element to mount into.
     * @param {boolean} shouldReuseMarkup If true, do not insert markup
     * @final
     * @internal
     * @see {ReactMount.render}
     */
    mountComponentIntoNode: function(rootID, container, shouldReuseMarkup) {
      var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
      transaction.perform(
        this._mountComponentIntoNode,
        this,
        rootID,
        container,
        transaction,
        shouldReuseMarkup
      );
      ReactUpdates.ReactReconcileTransaction.release(transaction);
    },

    /**
     * @param {string} rootID DOM ID of the root node.
     * @param {DOMElement} container DOM element to mount into.
     * @param {ReactReconcileTransaction} transaction
     * @param {boolean} shouldReuseMarkup If true, do not insert markup
     * @final
     * @private
     */
    _mountComponentIntoNode: function(
        rootID,
        container,
        transaction,
        shouldReuseMarkup) {
      var markup = this.mountComponent(rootID, transaction, 0);
      mountImageIntoNode(markup, container, shouldReuseMarkup);
    },

    /**
     * Checks if this component is owned by the supplied `owner` component.
     *
     * @param {ReactComponent} owner Component to check.
     * @return {boolean} True if `owners` owns this component.
     * @final
     * @internal
     */
    isOwnedBy: function(owner) {
      return this._owner === owner;
    },

    /**
     * Gets another component, that shares the same owner as this one, by ref.
     *
     * @param {string} ref of a sibling Component.
     * @return {?ReactComponent} the actual sibling Component.
     * @final
     * @internal
     */
    getSiblingByRef: function(ref) {
      var owner = this._owner;
      if (!owner || !owner.refs) {
        return null;
      }
      return owner.refs[ref];
    }
  }
};

module.exports = ReactComponent;

}).call(this,require('_process'))
},{"./Object.assign":59,"./ReactElement":85,"./ReactOwner":100,"./ReactUpdates":112,"./invariant":160,"./keyMirror":166,"_process":28}],66:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactComponentBrowserEnvironment
 */

/*jslint evil: true */

"use strict";

var ReactDOMIDOperations = require("./ReactDOMIDOperations");
var ReactMarkupChecksum = require("./ReactMarkupChecksum");
var ReactMount = require("./ReactMount");
var ReactPerf = require("./ReactPerf");
var ReactReconcileTransaction = require("./ReactReconcileTransaction");

var getReactRootElementInContainer = require("./getReactRootElementInContainer");
var invariant = require("./invariant");
var setInnerHTML = require("./setInnerHTML");


var ELEMENT_NODE_TYPE = 1;
var DOC_NODE_TYPE = 9;


/**
 * Abstracts away all functionality of `ReactComponent` requires knowledge of
 * the browser context.
 */
var ReactComponentBrowserEnvironment = {
  ReactReconcileTransaction: ReactReconcileTransaction,

  BackendIDOperations: ReactDOMIDOperations,

  /**
   * If a particular environment requires that some resources be cleaned up,
   * specify this in the injected Mixin. In the DOM, we would likely want to
   * purge any cached node ID lookups.
   *
   * @private
   */
  unmountIDFromEnvironment: function(rootNodeID) {
    ReactMount.purgeID(rootNodeID);
  },

  /**
   * @param {string} markup Markup string to place into the DOM Element.
   * @param {DOMElement} container DOM Element to insert markup into.
   * @param {boolean} shouldReuseMarkup Should reuse the existing markup in the
   * container if possible.
   */
  mountImageIntoNode: ReactPerf.measure(
    'ReactComponentBrowserEnvironment',
    'mountImageIntoNode',
    function(markup, container, shouldReuseMarkup) {
      ("production" !== process.env.NODE_ENV ? invariant(
        container && (
          container.nodeType === ELEMENT_NODE_TYPE ||
            container.nodeType === DOC_NODE_TYPE
        ),
        'mountComponentIntoNode(...): Target container is not valid.'
      ) : invariant(container && (
        container.nodeType === ELEMENT_NODE_TYPE ||
          container.nodeType === DOC_NODE_TYPE
      )));

      if (shouldReuseMarkup) {
        if (ReactMarkupChecksum.canReuseMarkup(
          markup,
          getReactRootElementInContainer(container))) {
          return;
        } else {
          ("production" !== process.env.NODE_ENV ? invariant(
            container.nodeType !== DOC_NODE_TYPE,
            'You\'re trying to render a component to the document using ' +
            'server rendering but the checksum was invalid. This usually ' +
            'means you rendered a different component type or props on ' +
            'the client from the one on the server, or your render() ' +
            'methods are impure. React cannot handle this case due to ' +
            'cross-browser quirks by rendering at the document root. You ' +
            'should look for environment dependent code in your components ' +
            'and ensure the props are the same client and server side.'
          ) : invariant(container.nodeType !== DOC_NODE_TYPE));

          if ("production" !== process.env.NODE_ENV) {
            console.warn(
              'React attempted to use reuse markup in a container but the ' +
              'checksum was invalid. This generally means that you are ' +
              'using server rendering and the markup generated on the ' +
              'server was not what the client was expecting. React injected ' +
              'new markup to compensate which works but you have lost many ' +
              'of the benefits of server rendering. Instead, figure out ' +
              'why the markup being generated is different on the client ' +
              'or server.'
            );
          }
        }
      }

      ("production" !== process.env.NODE_ENV ? invariant(
        container.nodeType !== DOC_NODE_TYPE,
        'You\'re trying to render a component to the document but ' +
          'you didn\'t use server rendering. We can\'t do this ' +
          'without using server rendering due to cross-browser quirks. ' +
          'See renderComponentToString() for server rendering.'
      ) : invariant(container.nodeType !== DOC_NODE_TYPE));

      setInnerHTML(container, markup);
    }
  )
};

module.exports = ReactComponentBrowserEnvironment;

}).call(this,require('_process'))
},{"./ReactDOMIDOperations":74,"./ReactMarkupChecksum":95,"./ReactMount":96,"./ReactPerf":101,"./ReactReconcileTransaction":107,"./getReactRootElementInContainer":154,"./invariant":160,"./setInnerHTML":174,"_process":28}],67:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactCompositeComponent
 */

"use strict";

var ReactComponent = require("./ReactComponent");
var ReactContext = require("./ReactContext");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactElement = require("./ReactElement");
var ReactElementValidator = require("./ReactElementValidator");
var ReactEmptyComponent = require("./ReactEmptyComponent");
var ReactErrorUtils = require("./ReactErrorUtils");
var ReactLegacyElement = require("./ReactLegacyElement");
var ReactOwner = require("./ReactOwner");
var ReactPerf = require("./ReactPerf");
var ReactPropTransferer = require("./ReactPropTransferer");
var ReactPropTypeLocations = require("./ReactPropTypeLocations");
var ReactPropTypeLocationNames = require("./ReactPropTypeLocationNames");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");
var instantiateReactComponent = require("./instantiateReactComponent");
var invariant = require("./invariant");
var keyMirror = require("./keyMirror");
var keyOf = require("./keyOf");
var monitorCodeUse = require("./monitorCodeUse");
var mapObject = require("./mapObject");
var shouldUpdateReactComponent = require("./shouldUpdateReactComponent");
var warning = require("./warning");

var MIXINS_KEY = keyOf({mixins: null});

/**
 * Policies that describe methods in `ReactCompositeComponentInterface`.
 */
var SpecPolicy = keyMirror({
  /**
   * These methods may be defined only once by the class specification or mixin.
   */
  DEFINE_ONCE: null,
  /**
   * These methods may be defined by both the class specification and mixins.
   * Subsequent definitions will be chained. These methods must return void.
   */
  DEFINE_MANY: null,
  /**
   * These methods are overriding the base ReactCompositeComponent class.
   */
  OVERRIDE_BASE: null,
  /**
   * These methods are similar to DEFINE_MANY, except we assume they return
   * objects. We try to merge the keys of the return values of all the mixed in
   * functions. If there is a key conflict we throw.
   */
  DEFINE_MANY_MERGED: null
});


var injectedMixins = [];

/**
 * Composite components are higher-level components that compose other composite
 * or native components.
 *
 * To create a new type of `ReactCompositeComponent`, pass a specification of
 * your new class to `React.createClass`. The only requirement of your class
 * specification is that you implement a `render` method.
 *
 *   var MyComponent = React.createClass({
 *     render: function() {
 *       return <div>Hello World</div>;
 *     }
 *   });
 *
 * The class specification supports a specific protocol of methods that have
 * special meaning (e.g. `render`). See `ReactCompositeComponentInterface` for
 * more the comprehensive protocol. Any other properties and methods in the
 * class specification will available on the prototype.
 *
 * @interface ReactCompositeComponentInterface
 * @internal
 */
var ReactCompositeComponentInterface = {

  /**
   * An array of Mixin objects to include when defining your component.
   *
   * @type {array}
   * @optional
   */
  mixins: SpecPolicy.DEFINE_MANY,

  /**
   * An object containing properties and methods that should be defined on
   * the component's constructor instead of its prototype (static methods).
   *
   * @type {object}
   * @optional
   */
  statics: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of prop types for this component.
   *
   * @type {object}
   * @optional
   */
  propTypes: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of context types for this component.
   *
   * @type {object}
   * @optional
   */
  contextTypes: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of context types this component sets for its children.
   *
   * @type {object}
   * @optional
   */
  childContextTypes: SpecPolicy.DEFINE_MANY,

  // ==== Definition methods ====

  /**
   * Invoked when the component is mounted. Values in the mapping will be set on
   * `this.props` if that prop is not specified (i.e. using an `in` check).
   *
   * This method is invoked before `getInitialState` and therefore cannot rely
   * on `this.state` or use `this.setState`.
   *
   * @return {object}
   * @optional
   */
  getDefaultProps: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * Invoked once before the component is mounted. The return value will be used
   * as the initial value of `this.state`.
   *
   *   getInitialState: function() {
   *     return {
   *       isOn: false,
   *       fooBaz: new BazFoo()
   *     }
   *   }
   *
   * @return {object}
   * @optional
   */
  getInitialState: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * @return {object}
   * @optional
   */
  getChildContext: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * Uses props from `this.props` and state from `this.state` to render the
   * structure of the component.
   *
   * No guarantees are made about when or how often this method is invoked, so
   * it must not have side effects.
   *
   *   render: function() {
   *     var name = this.props.name;
   *     return <div>Hello, {name}!</div>;
   *   }
   *
   * @return {ReactComponent}
   * @nosideeffects
   * @required
   */
  render: SpecPolicy.DEFINE_ONCE,



  // ==== Delegate methods ====

  /**
   * Invoked when the component is initially created and about to be mounted.
   * This may have side effects, but any external subscriptions or data created
   * by this method must be cleaned up in `componentWillUnmount`.
   *
   * @optional
   */
  componentWillMount: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component has been mounted and has a DOM representation.
   * However, there is no guarantee that the DOM node is in the document.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been mounted (initialized and rendered) for the first time.
   *
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidMount: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked before the component receives new props.
   *
   * Use this as an opportunity to react to a prop transition by updating the
   * state using `this.setState`. Current props are accessed via `this.props`.
   *
   *   componentWillReceiveProps: function(nextProps, nextContext) {
   *     this.setState({
   *       likesIncreasing: nextProps.likeCount > this.props.likeCount
   *     });
   *   }
   *
   * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
   * transition may cause a state change, but the opposite is not true. If you
   * need it, you are probably looking for `componentWillUpdate`.
   *
   * @param {object} nextProps
   * @optional
   */
  componentWillReceiveProps: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked while deciding if the component should be updated as a result of
   * receiving new props, state and/or context.
   *
   * Use this as an opportunity to `return false` when you're certain that the
   * transition to the new props/state/context will not require a component
   * update.
   *
   *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
   *     return !equal(nextProps, this.props) ||
   *       !equal(nextState, this.state) ||
   *       !equal(nextContext, this.context);
   *   }
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @return {boolean} True if the component should update.
   * @optional
   */
  shouldComponentUpdate: SpecPolicy.DEFINE_ONCE,

  /**
   * Invoked when the component is about to update due to a transition from
   * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
   * and `nextContext`.
   *
   * Use this as an opportunity to perform preparation before an update occurs.
   *
   * NOTE: You **cannot** use `this.setState()` in this method.
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @param {ReactReconcileTransaction} transaction
   * @optional
   */
  componentWillUpdate: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component's DOM representation has been updated.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been updated.
   *
   * @param {object} prevProps
   * @param {?object} prevState
   * @param {?object} prevContext
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidUpdate: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component is about to be removed from its parent and have
   * its DOM representation destroyed.
   *
   * Use this as an opportunity to deallocate any external resources.
   *
   * NOTE: There is no `componentDidUnmount` since your component will have been
   * destroyed by that point.
   *
   * @optional
   */
  componentWillUnmount: SpecPolicy.DEFINE_MANY,



  // ==== Advanced methods ====

  /**
   * Updates the component's currently mounted DOM representation.
   *
   * By default, this implements React's rendering and reconciliation algorithm.
   * Sophisticated clients may wish to override this.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   * @overridable
   */
  updateComponent: SpecPolicy.OVERRIDE_BASE

};

/**
 * Mapping from class specification keys to special processing functions.
 *
 * Although these are declared like instance properties in the specification
 * when defining classes using `React.createClass`, they are actually static
 * and are accessible on the constructor instead of the prototype. Despite
 * being static, they must be defined outside of the "statics" key under
 * which all other static methods are defined.
 */
var RESERVED_SPEC_KEYS = {
  displayName: function(Constructor, displayName) {
    Constructor.displayName = displayName;
  },
  mixins: function(Constructor, mixins) {
    if (mixins) {
      for (var i = 0; i < mixins.length; i++) {
        mixSpecIntoComponent(Constructor, mixins[i]);
      }
    }
  },
  childContextTypes: function(Constructor, childContextTypes) {
    validateTypeDef(
      Constructor,
      childContextTypes,
      ReactPropTypeLocations.childContext
    );
    Constructor.childContextTypes = assign(
      {},
      Constructor.childContextTypes,
      childContextTypes
    );
  },
  contextTypes: function(Constructor, contextTypes) {
    validateTypeDef(
      Constructor,
      contextTypes,
      ReactPropTypeLocations.context
    );
    Constructor.contextTypes = assign(
      {},
      Constructor.contextTypes,
      contextTypes
    );
  },
  /**
   * Special case getDefaultProps which should move into statics but requires
   * automatic merging.
   */
  getDefaultProps: function(Constructor, getDefaultProps) {
    if (Constructor.getDefaultProps) {
      Constructor.getDefaultProps = createMergedResultFunction(
        Constructor.getDefaultProps,
        getDefaultProps
      );
    } else {
      Constructor.getDefaultProps = getDefaultProps;
    }
  },
  propTypes: function(Constructor, propTypes) {
    validateTypeDef(
      Constructor,
      propTypes,
      ReactPropTypeLocations.prop
    );
    Constructor.propTypes = assign(
      {},
      Constructor.propTypes,
      propTypes
    );
  },
  statics: function(Constructor, statics) {
    mixStaticSpecIntoComponent(Constructor, statics);
  }
};

function getDeclarationErrorAddendum(component) {
  var owner = component._owner || null;
  if (owner && owner.constructor && owner.constructor.displayName) {
    return ' Check the render method of `' + owner.constructor.displayName +
      '`.';
  }
  return '';
}

function validateTypeDef(Constructor, typeDef, location) {
  for (var propName in typeDef) {
    if (typeDef.hasOwnProperty(propName)) {
      ("production" !== process.env.NODE_ENV ? invariant(
        typeof typeDef[propName] == 'function',
        '%s: %s type `%s` is invalid; it must be a function, usually from ' +
        'React.PropTypes.',
        Constructor.displayName || 'ReactCompositeComponent',
        ReactPropTypeLocationNames[location],
        propName
      ) : invariant(typeof typeDef[propName] == 'function'));
    }
  }
}

function validateMethodOverride(proto, name) {
  var specPolicy = ReactCompositeComponentInterface.hasOwnProperty(name) ?
    ReactCompositeComponentInterface[name] :
    null;

  // Disallow overriding of base class methods unless explicitly allowed.
  if (ReactCompositeComponentMixin.hasOwnProperty(name)) {
    ("production" !== process.env.NODE_ENV ? invariant(
      specPolicy === SpecPolicy.OVERRIDE_BASE,
      'ReactCompositeComponentInterface: You are attempting to override ' +
      '`%s` from your class specification. Ensure that your method names ' +
      'do not overlap with React methods.',
      name
    ) : invariant(specPolicy === SpecPolicy.OVERRIDE_BASE));
  }

  // Disallow defining methods more than once unless explicitly allowed.
  if (proto.hasOwnProperty(name)) {
    ("production" !== process.env.NODE_ENV ? invariant(
      specPolicy === SpecPolicy.DEFINE_MANY ||
      specPolicy === SpecPolicy.DEFINE_MANY_MERGED,
      'ReactCompositeComponentInterface: You are attempting to define ' +
      '`%s` on your component more than once. This conflict may be due ' +
      'to a mixin.',
      name
    ) : invariant(specPolicy === SpecPolicy.DEFINE_MANY ||
    specPolicy === SpecPolicy.DEFINE_MANY_MERGED));
  }
}

function validateLifeCycleOnReplaceState(instance) {
  var compositeLifeCycleState = instance._compositeLifeCycleState;
  ("production" !== process.env.NODE_ENV ? invariant(
    instance.isMounted() ||
      compositeLifeCycleState === CompositeLifeCycle.MOUNTING,
    'replaceState(...): Can only update a mounted or mounting component.'
  ) : invariant(instance.isMounted() ||
    compositeLifeCycleState === CompositeLifeCycle.MOUNTING));
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactCurrentOwner.current == null,
    'replaceState(...): Cannot update during an existing state transition ' +
    '(such as within `render`). Render methods should be a pure function ' +
    'of props and state.'
  ) : invariant(ReactCurrentOwner.current == null));
  ("production" !== process.env.NODE_ENV ? invariant(compositeLifeCycleState !== CompositeLifeCycle.UNMOUNTING,
    'replaceState(...): Cannot update while unmounting component. This ' +
    'usually means you called setState() on an unmounted component.'
  ) : invariant(compositeLifeCycleState !== CompositeLifeCycle.UNMOUNTING));
}

/**
 * Mixin helper which handles policy validation and reserved
 * specification keys when building `ReactCompositeComponent` classses.
 */
function mixSpecIntoComponent(Constructor, spec) {
  if (!spec) {
    return;
  }

  ("production" !== process.env.NODE_ENV ? invariant(
    !ReactLegacyElement.isValidFactory(spec),
    'ReactCompositeComponent: You\'re attempting to ' +
    'use a component class as a mixin. Instead, just use a regular object.'
  ) : invariant(!ReactLegacyElement.isValidFactory(spec)));
  ("production" !== process.env.NODE_ENV ? invariant(
    !ReactElement.isValidElement(spec),
    'ReactCompositeComponent: You\'re attempting to ' +
    'use a component as a mixin. Instead, just use a regular object.'
  ) : invariant(!ReactElement.isValidElement(spec)));

  var proto = Constructor.prototype;

  // By handling mixins before any other properties, we ensure the same
  // chaining order is applied to methods with DEFINE_MANY policy, whether
  // mixins are listed before or after these methods in the spec.
  if (spec.hasOwnProperty(MIXINS_KEY)) {
    RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
  }

  for (var name in spec) {
    if (!spec.hasOwnProperty(name)) {
      continue;
    }

    if (name === MIXINS_KEY) {
      // We have already handled mixins in a special case above
      continue;
    }

    var property = spec[name];
    validateMethodOverride(proto, name);

    if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
      RESERVED_SPEC_KEYS[name](Constructor, property);
    } else {
      // Setup methods on prototype:
      // The following member methods should not be automatically bound:
      // 1. Expected ReactCompositeComponent methods (in the "interface").
      // 2. Overridden methods (that were mixed in).
      var isCompositeComponentMethod =
        ReactCompositeComponentInterface.hasOwnProperty(name);
      var isAlreadyDefined = proto.hasOwnProperty(name);
      var markedDontBind = property && property.__reactDontBind;
      var isFunction = typeof property === 'function';
      var shouldAutoBind =
        isFunction &&
        !isCompositeComponentMethod &&
        !isAlreadyDefined &&
        !markedDontBind;

      if (shouldAutoBind) {
        if (!proto.__reactAutoBindMap) {
          proto.__reactAutoBindMap = {};
        }
        proto.__reactAutoBindMap[name] = property;
        proto[name] = property;
      } else {
        if (isAlreadyDefined) {
          var specPolicy = ReactCompositeComponentInterface[name];

          // These cases should already be caught by validateMethodOverride
          ("production" !== process.env.NODE_ENV ? invariant(
            isCompositeComponentMethod && (
              specPolicy === SpecPolicy.DEFINE_MANY_MERGED ||
              specPolicy === SpecPolicy.DEFINE_MANY
            ),
            'ReactCompositeComponent: Unexpected spec policy %s for key %s ' +
            'when mixing in component specs.',
            specPolicy,
            name
          ) : invariant(isCompositeComponentMethod && (
            specPolicy === SpecPolicy.DEFINE_MANY_MERGED ||
            specPolicy === SpecPolicy.DEFINE_MANY
          )));

          // For methods which are defined more than once, call the existing
          // methods before calling the new property, merging if appropriate.
          if (specPolicy === SpecPolicy.DEFINE_MANY_MERGED) {
            proto[name] = createMergedResultFunction(proto[name], property);
          } else if (specPolicy === SpecPolicy.DEFINE_MANY) {
            proto[name] = createChainedFunction(proto[name], property);
          }
        } else {
          proto[name] = property;
          if ("production" !== process.env.NODE_ENV) {
            // Add verbose displayName to the function, which helps when looking
            // at profiling tools.
            if (typeof property === 'function' && spec.displayName) {
              proto[name].displayName = spec.displayName + '_' + name;
            }
          }
        }
      }
    }
  }
}

function mixStaticSpecIntoComponent(Constructor, statics) {
  if (!statics) {
    return;
  }
  for (var name in statics) {
    var property = statics[name];
    if (!statics.hasOwnProperty(name)) {
      continue;
    }

    var isReserved = name in RESERVED_SPEC_KEYS;
    ("production" !== process.env.NODE_ENV ? invariant(
      !isReserved,
      'ReactCompositeComponent: You are attempting to define a reserved ' +
      'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' +
      'as an instance property instead; it will still be accessible on the ' +
      'constructor.',
      name
    ) : invariant(!isReserved));

    var isInherited = name in Constructor;
    ("production" !== process.env.NODE_ENV ? invariant(
      !isInherited,
      'ReactCompositeComponent: You are attempting to define ' +
      '`%s` on your component more than once. This conflict may be ' +
      'due to a mixin.',
      name
    ) : invariant(!isInherited));
    Constructor[name] = property;
  }
}

/**
 * Merge two objects, but throw if both contain the same key.
 *
 * @param {object} one The first object, which is mutated.
 * @param {object} two The second object
 * @return {object} one after it has been mutated to contain everything in two.
 */
function mergeObjectsWithNoDuplicateKeys(one, two) {
  ("production" !== process.env.NODE_ENV ? invariant(
    one && two && typeof one === 'object' && typeof two === 'object',
    'mergeObjectsWithNoDuplicateKeys(): Cannot merge non-objects'
  ) : invariant(one && two && typeof one === 'object' && typeof two === 'object'));

  mapObject(two, function(value, key) {
    ("production" !== process.env.NODE_ENV ? invariant(
      one[key] === undefined,
      'mergeObjectsWithNoDuplicateKeys(): ' +
      'Tried to merge two objects with the same key: `%s`. This conflict ' +
      'may be due to a mixin; in particular, this may be caused by two ' +
      'getInitialState() or getDefaultProps() methods returning objects ' +
      'with clashing keys.',
      key
    ) : invariant(one[key] === undefined));
    one[key] = value;
  });
  return one;
}

/**
 * Creates a function that invokes two functions and merges their return values.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createMergedResultFunction(one, two) {
  return function mergedResult() {
    var a = one.apply(this, arguments);
    var b = two.apply(this, arguments);
    if (a == null) {
      return b;
    } else if (b == null) {
      return a;
    }
    return mergeObjectsWithNoDuplicateKeys(a, b);
  };
}

/**
 * Creates a function that invokes two functions and ignores their return vales.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createChainedFunction(one, two) {
  return function chainedFunction() {
    one.apply(this, arguments);
    two.apply(this, arguments);
  };
}

/**
 * `ReactCompositeComponent` maintains an auxiliary life cycle state in
 * `this._compositeLifeCycleState` (which can be null).
 *
 * This is different from the life cycle state maintained by `ReactComponent` in
 * `this._lifeCycleState`. The following diagram shows how the states overlap in
 * time. There are times when the CompositeLifeCycle is null - at those times it
 * is only meaningful to look at ComponentLifeCycle alone.
 *
 * Top Row: ReactComponent.ComponentLifeCycle
 * Low Row: ReactComponent.CompositeLifeCycle
 *
 * +-------+---------------------------------+--------+
 * |  UN   |             MOUNTED             |   UN   |
 * |MOUNTED|                                 | MOUNTED|
 * +-------+---------------------------------+--------+
 * |       ^--------+   +-------+   +--------^        |
 * |       |        |   |       |   |        |        |
 * |    0--|MOUNTING|-0-|RECEIVE|-0-|   UN   |--->0   |
 * |       |        |   |PROPS  |   |MOUNTING|        |
 * |       |        |   |       |   |        |        |
 * |       |        |   |       |   |        |        |
 * |       +--------+   +-------+   +--------+        |
 * |       |                                 |        |
 * +-------+---------------------------------+--------+
 */
var CompositeLifeCycle = keyMirror({
  /**
   * Components in the process of being mounted respond to state changes
   * differently.
   */
  MOUNTING: null,
  /**
   * Components in the process of being unmounted are guarded against state
   * changes.
   */
  UNMOUNTING: null,
  /**
   * Components that are mounted and receiving new props respond to state
   * changes differently.
   */
  RECEIVING_PROPS: null
});

/**
 * @lends {ReactCompositeComponent.prototype}
 */
var ReactCompositeComponentMixin = {

  /**
   * Base constructor for all composite component.
   *
   * @param {ReactElement} element
   * @final
   * @internal
   */
  construct: function(element) {
    // Children can be either an array or more than one argument
    ReactComponent.Mixin.construct.apply(this, arguments);
    ReactOwner.Mixin.construct.apply(this, arguments);

    this.state = null;
    this._pendingState = null;

    // This is the public post-processed context. The real context and pending
    // context lives on the element.
    this.context = null;

    this._compositeLifeCycleState = null;
  },

  /**
   * Checks whether or not this composite component is mounted.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function() {
    return ReactComponent.Mixin.isMounted.call(this) &&
      this._compositeLifeCycleState !== CompositeLifeCycle.MOUNTING;
  },

  /**
   * Initializes the component, renders markup, and registers event listeners.
   *
   * @param {string} rootID DOM ID of the root node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {number} mountDepth number of components in the owner hierarchy
   * @return {?string} Rendered markup to be inserted into the DOM.
   * @final
   * @internal
   */
  mountComponent: ReactPerf.measure(
    'ReactCompositeComponent',
    'mountComponent',
    function(rootID, transaction, mountDepth) {
      ReactComponent.Mixin.mountComponent.call(
        this,
        rootID,
        transaction,
        mountDepth
      );
      this._compositeLifeCycleState = CompositeLifeCycle.MOUNTING;

      if (this.__reactAutoBindMap) {
        this._bindAutoBindMethods();
      }

      this.context = this._processContext(this._currentElement._context);
      this.props = this._processProps(this.props);

      this.state = this.getInitialState ? this.getInitialState() : null;
      ("production" !== process.env.NODE_ENV ? invariant(
        typeof this.state === 'object' && !Array.isArray(this.state),
        '%s.getInitialState(): must return an object or null',
        this.constructor.displayName || 'ReactCompositeComponent'
      ) : invariant(typeof this.state === 'object' && !Array.isArray(this.state)));

      this._pendingState = null;
      this._pendingForceUpdate = false;

      if (this.componentWillMount) {
        this.componentWillMount();
        // When mounting, calls to `setState` by `componentWillMount` will set
        // `this._pendingState` without triggering a re-render.
        if (this._pendingState) {
          this.state = this._pendingState;
          this._pendingState = null;
        }
      }

      this._renderedComponent = instantiateReactComponent(
        this._renderValidatedComponent(),
        this._currentElement.type // The wrapping type
      );

      // Done with mounting, `setState` will now trigger UI changes.
      this._compositeLifeCycleState = null;
      var markup = this._renderedComponent.mountComponent(
        rootID,
        transaction,
        mountDepth + 1
      );
      if (this.componentDidMount) {
        transaction.getReactMountReady().enqueue(this.componentDidMount, this);
      }
      return markup;
    }
  ),

  /**
   * Releases any resources allocated by `mountComponent`.
   *
   * @final
   * @internal
   */
  unmountComponent: function() {
    this._compositeLifeCycleState = CompositeLifeCycle.UNMOUNTING;
    if (this.componentWillUnmount) {
      this.componentWillUnmount();
    }
    this._compositeLifeCycleState = null;

    this._renderedComponent.unmountComponent();
    this._renderedComponent = null;

    ReactComponent.Mixin.unmountComponent.call(this);

    // Some existing components rely on this.props even after they've been
    // destroyed (in event handlers).
    // TODO: this.props = null;
    // TODO: this.state = null;
  },

  /**
   * Sets a subset of the state. Always use this or `replaceState` to mutate
   * state. You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * There is no guarantee that calls to `setState` will run synchronously,
   * as they may eventually be batched together.  You can provide an optional
   * callback that will be executed when the call to setState is actually
   * completed.
   *
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */
  setState: function(partialState, callback) {
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof partialState === 'object' || partialState == null,
      'setState(...): takes an object of state variables to update.'
    ) : invariant(typeof partialState === 'object' || partialState == null));
    if ("production" !== process.env.NODE_ENV){
      ("production" !== process.env.NODE_ENV ? warning(
        partialState != null,
        'setState(...): You passed an undefined or null state object; ' +
        'instead, use forceUpdate().'
      ) : null);
    }
    // Merge with `_pendingState` if it exists, otherwise with existing state.
    this.replaceState(
      assign({}, this._pendingState || this.state, partialState),
      callback
    );
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {object} completeState Next state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */
  replaceState: function(completeState, callback) {
    validateLifeCycleOnReplaceState(this);
    this._pendingState = completeState;
    if (this._compositeLifeCycleState !== CompositeLifeCycle.MOUNTING) {
      // If we're in a componentWillMount handler, don't enqueue a rerender
      // because ReactUpdates assumes we're in a browser context (which is wrong
      // for server rendering) and we're about to do a render anyway.
      // TODO: The callback here is ignored when setState is called from
      // componentWillMount. Either fix it or disallow doing so completely in
      // favor of getInitialState.
      ReactUpdates.enqueueUpdate(this, callback);
    }
  },

  /**
   * Filters the context object to only contain keys specified in
   * `contextTypes`, and asserts that they are valid.
   *
   * @param {object} context
   * @return {?object}
   * @private
   */
  _processContext: function(context) {
    var maskedContext = null;
    var contextTypes = this.constructor.contextTypes;
    if (contextTypes) {
      maskedContext = {};
      for (var contextName in contextTypes) {
        maskedContext[contextName] = context[contextName];
      }
      if ("production" !== process.env.NODE_ENV) {
        this._checkPropTypes(
          contextTypes,
          maskedContext,
          ReactPropTypeLocations.context
        );
      }
    }
    return maskedContext;
  },

  /**
   * @param {object} currentContext
   * @return {object}
   * @private
   */
  _processChildContext: function(currentContext) {
    var childContext = this.getChildContext && this.getChildContext();
    var displayName = this.constructor.displayName || 'ReactCompositeComponent';
    if (childContext) {
      ("production" !== process.env.NODE_ENV ? invariant(
        typeof this.constructor.childContextTypes === 'object',
        '%s.getChildContext(): childContextTypes must be defined in order to ' +
        'use getChildContext().',
        displayName
      ) : invariant(typeof this.constructor.childContextTypes === 'object'));
      if ("production" !== process.env.NODE_ENV) {
        this._checkPropTypes(
          this.constructor.childContextTypes,
          childContext,
          ReactPropTypeLocations.childContext
        );
      }
      for (var name in childContext) {
        ("production" !== process.env.NODE_ENV ? invariant(
          name in this.constructor.childContextTypes,
          '%s.getChildContext(): key "%s" is not defined in childContextTypes.',
          displayName,
          name
        ) : invariant(name in this.constructor.childContextTypes));
      }
      return assign({}, currentContext, childContext);
    }
    return currentContext;
  },

  /**
   * Processes props by setting default values for unspecified props and
   * asserting that the props are valid. Does not mutate its argument; returns
   * a new props object with defaults merged in.
   *
   * @param {object} newProps
   * @return {object}
   * @private
   */
  _processProps: function(newProps) {
    if ("production" !== process.env.NODE_ENV) {
      var propTypes = this.constructor.propTypes;
      if (propTypes) {
        this._checkPropTypes(propTypes, newProps, ReactPropTypeLocations.prop);
      }
    }
    return newProps;
  },

  /**
   * Assert that the props are valid
   *
   * @param {object} propTypes Map of prop name to a ReactPropType
   * @param {object} props
   * @param {string} location e.g. "prop", "context", "child context"
   * @private
   */
  _checkPropTypes: function(propTypes, props, location) {
    // TODO: Stop validating prop types here and only use the element
    // validation.
    var componentName = this.constructor.displayName;
    for (var propName in propTypes) {
      if (propTypes.hasOwnProperty(propName)) {
        var error =
          propTypes[propName](props, propName, componentName, location);
        if (error instanceof Error) {
          // We may want to extend this logic for similar errors in
          // renderComponent calls, so I'm abstracting it away into
          // a function to minimize refactoring in the future
          var addendum = getDeclarationErrorAddendum(this);
          ("production" !== process.env.NODE_ENV ? warning(false, error.message + addendum) : null);
        }
      }
    }
  },

  /**
   * If any of `_pendingElement`, `_pendingState`, or `_pendingForceUpdate`
   * is set, update the component.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  performUpdateIfNecessary: function(transaction) {
    var compositeLifeCycleState = this._compositeLifeCycleState;
    // Do not trigger a state transition if we are in the middle of mounting or
    // receiving props because both of those will already be doing this.
    if (compositeLifeCycleState === CompositeLifeCycle.MOUNTING ||
        compositeLifeCycleState === CompositeLifeCycle.RECEIVING_PROPS) {
      return;
    }

    if (this._pendingElement == null &&
        this._pendingState == null &&
        !this._pendingForceUpdate) {
      return;
    }

    var nextContext = this.context;
    var nextProps = this.props;
    var nextElement = this._currentElement;
    if (this._pendingElement != null) {
      nextElement = this._pendingElement;
      nextContext = this._processContext(nextElement._context);
      nextProps = this._processProps(nextElement.props);
      this._pendingElement = null;

      this._compositeLifeCycleState = CompositeLifeCycle.RECEIVING_PROPS;
      if (this.componentWillReceiveProps) {
        this.componentWillReceiveProps(nextProps, nextContext);
      }
    }

    this._compositeLifeCycleState = null;

    var nextState = this._pendingState || this.state;
    this._pendingState = null;

    var shouldUpdate =
      this._pendingForceUpdate ||
      !this.shouldComponentUpdate ||
      this.shouldComponentUpdate(nextProps, nextState, nextContext);

    if ("production" !== process.env.NODE_ENV) {
      if (typeof shouldUpdate === "undefined") {
        console.warn(
          (this.constructor.displayName || 'ReactCompositeComponent') +
          '.shouldComponentUpdate(): Returned undefined instead of a ' +
          'boolean value. Make sure to return true or false.'
        );
      }
    }

    if (shouldUpdate) {
      this._pendingForceUpdate = false;
      // Will set `this.props`, `this.state` and `this.context`.
      this._performComponentUpdate(
        nextElement,
        nextProps,
        nextState,
        nextContext,
        transaction
      );
    } else {
      // If it's determined that a component should not update, we still want
      // to set props and state.
      this._currentElement = nextElement;
      this.props = nextProps;
      this.state = nextState;
      this.context = nextContext;

      // Owner cannot change because shouldUpdateReactComponent doesn't allow
      // it. TODO: Remove this._owner completely.
      this._owner = nextElement._owner;
    }
  },

  /**
   * Merges new props and state, notifies delegate methods of update and
   * performs update.
   *
   * @param {ReactElement} nextElement Next element
   * @param {object} nextProps Next public object to set as properties.
   * @param {?object} nextState Next object to set as state.
   * @param {?object} nextContext Next public object to set as context.
   * @param {ReactReconcileTransaction} transaction
   * @private
   */
  _performComponentUpdate: function(
    nextElement,
    nextProps,
    nextState,
    nextContext,
    transaction
  ) {
    var prevElement = this._currentElement;
    var prevProps = this.props;
    var prevState = this.state;
    var prevContext = this.context;

    if (this.componentWillUpdate) {
      this.componentWillUpdate(nextProps, nextState, nextContext);
    }

    this._currentElement = nextElement;
    this.props = nextProps;
    this.state = nextState;
    this.context = nextContext;

    // Owner cannot change because shouldUpdateReactComponent doesn't allow
    // it. TODO: Remove this._owner completely.
    this._owner = nextElement._owner;

    this.updateComponent(
      transaction,
      prevElement
    );

    if (this.componentDidUpdate) {
      transaction.getReactMountReady().enqueue(
        this.componentDidUpdate.bind(this, prevProps, prevState, prevContext),
        this
      );
    }
  },

  receiveComponent: function(nextElement, transaction) {
    if (nextElement === this._currentElement &&
        nextElement._owner != null) {
      // Since elements are immutable after the owner is rendered,
      // we can do a cheap identity compare here to determine if this is a
      // superfluous reconcile. It's possible for state to be mutable but such
      // change should trigger an update of the owner which would recreate
      // the element. We explicitly check for the existence of an owner since
      // it's possible for a element created outside a composite to be
      // deeply mutated and reused.
      return;
    }

    ReactComponent.Mixin.receiveComponent.call(
      this,
      nextElement,
      transaction
    );
  },

  /**
   * Updates the component's currently mounted DOM representation.
   *
   * By default, this implements React's rendering and reconciliation algorithm.
   * Sophisticated clients may wish to override this.
   *
   * @param {ReactReconcileTransaction} transaction
   * @param {ReactElement} prevElement
   * @internal
   * @overridable
   */
  updateComponent: ReactPerf.measure(
    'ReactCompositeComponent',
    'updateComponent',
    function(transaction, prevParentElement) {
      ReactComponent.Mixin.updateComponent.call(
        this,
        transaction,
        prevParentElement
      );

      var prevComponentInstance = this._renderedComponent;
      var prevElement = prevComponentInstance._currentElement;
      var nextElement = this._renderValidatedComponent();
      if (shouldUpdateReactComponent(prevElement, nextElement)) {
        prevComponentInstance.receiveComponent(nextElement, transaction);
      } else {
        // These two IDs are actually the same! But nothing should rely on that.
        var thisID = this._rootNodeID;
        var prevComponentID = prevComponentInstance._rootNodeID;
        prevComponentInstance.unmountComponent();
        this._renderedComponent = instantiateReactComponent(
          nextElement,
          this._currentElement.type
        );
        var nextMarkup = this._renderedComponent.mountComponent(
          thisID,
          transaction,
          this._mountDepth + 1
        );
        ReactComponent.BackendIDOperations.dangerouslyReplaceNodeWithMarkupByID(
          prevComponentID,
          nextMarkup
        );
      }
    }
  ),

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldUpdateComponent`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {?function} callback Called after update is complete.
   * @final
   * @protected
   */
  forceUpdate: function(callback) {
    var compositeLifeCycleState = this._compositeLifeCycleState;
    ("production" !== process.env.NODE_ENV ? invariant(
      this.isMounted() ||
        compositeLifeCycleState === CompositeLifeCycle.MOUNTING,
      'forceUpdate(...): Can only force an update on mounted or mounting ' +
        'components.'
    ) : invariant(this.isMounted() ||
      compositeLifeCycleState === CompositeLifeCycle.MOUNTING));
    ("production" !== process.env.NODE_ENV ? invariant(
      compositeLifeCycleState !== CompositeLifeCycle.UNMOUNTING &&
      ReactCurrentOwner.current == null,
      'forceUpdate(...): Cannot force an update while unmounting component ' +
      'or within a `render` function.'
    ) : invariant(compositeLifeCycleState !== CompositeLifeCycle.UNMOUNTING &&
    ReactCurrentOwner.current == null));
    this._pendingForceUpdate = true;
    ReactUpdates.enqueueUpdate(this, callback);
  },

  /**
   * @private
   */
  _renderValidatedComponent: ReactPerf.measure(
    'ReactCompositeComponent',
    '_renderValidatedComponent',
    function() {
      var renderedComponent;
      var previousContext = ReactContext.current;
      ReactContext.current = this._processChildContext(
        this._currentElement._context
      );
      ReactCurrentOwner.current = this;
      try {
        renderedComponent = this.render();
        if (renderedComponent === null || renderedComponent === false) {
          renderedComponent = ReactEmptyComponent.getEmptyComponent();
          ReactEmptyComponent.registerNullComponentID(this._rootNodeID);
        } else {
          ReactEmptyComponent.deregisterNullComponentID(this._rootNodeID);
        }
      } finally {
        ReactContext.current = previousContext;
        ReactCurrentOwner.current = null;
      }
      ("production" !== process.env.NODE_ENV ? invariant(
        ReactElement.isValidElement(renderedComponent),
        '%s.render(): A valid ReactComponent must be returned. You may have ' +
          'returned undefined, an array or some other invalid object.',
        this.constructor.displayName || 'ReactCompositeComponent'
      ) : invariant(ReactElement.isValidElement(renderedComponent)));
      return renderedComponent;
    }
  ),

  /**
   * @private
   */
  _bindAutoBindMethods: function() {
    for (var autoBindKey in this.__reactAutoBindMap) {
      if (!this.__reactAutoBindMap.hasOwnProperty(autoBindKey)) {
        continue;
      }
      var method = this.__reactAutoBindMap[autoBindKey];
      this[autoBindKey] = this._bindAutoBindMethod(ReactErrorUtils.guard(
        method,
        this.constructor.displayName + '.' + autoBindKey
      ));
    }
  },

  /**
   * Binds a method to the component.
   *
   * @param {function} method Method to be bound.
   * @private
   */
  _bindAutoBindMethod: function(method) {
    var component = this;
    var boundMethod = method.bind(component);
    if ("production" !== process.env.NODE_ENV) {
      boundMethod.__reactBoundContext = component;
      boundMethod.__reactBoundMethod = method;
      boundMethod.__reactBoundArguments = null;
      var componentName = component.constructor.displayName;
      var _bind = boundMethod.bind;
      boundMethod.bind = function(newThis ) {for (var args=[],$__0=1,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
        // User is trying to bind() an autobound method; we effectively will
        // ignore the value of "this" that the user is trying to use, so
        // let's warn.
        if (newThis !== component && newThis !== null) {
          monitorCodeUse('react_bind_warning', { component: componentName });
          console.warn(
            'bind(): React component methods may only be bound to the ' +
            'component instance. See ' + componentName
          );
        } else if (!args.length) {
          monitorCodeUse('react_bind_warning', { component: componentName });
          console.warn(
            'bind(): You are binding a component method to the component. ' +
            'React does this for you automatically in a high-performance ' +
            'way, so you can safely remove this call. See ' + componentName
          );
          return boundMethod;
        }
        var reboundMethod = _bind.apply(boundMethod, arguments);
        reboundMethod.__reactBoundContext = component;
        reboundMethod.__reactBoundMethod = method;
        reboundMethod.__reactBoundArguments = args;
        return reboundMethod;
      };
    }
    return boundMethod;
  }
};

var ReactCompositeComponentBase = function() {};
assign(
  ReactCompositeComponentBase.prototype,
  ReactComponent.Mixin,
  ReactOwner.Mixin,
  ReactPropTransferer.Mixin,
  ReactCompositeComponentMixin
);

/**
 * Module for creating composite components.
 *
 * @class ReactCompositeComponent
 * @extends ReactComponent
 * @extends ReactOwner
 * @extends ReactPropTransferer
 */
var ReactCompositeComponent = {

  LifeCycle: CompositeLifeCycle,

  Base: ReactCompositeComponentBase,

  /**
   * Creates a composite component class given a class specification.
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  createClass: function(spec) {
    var Constructor = function(props) {
      // This constructor is overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted. This will later be used
      // by the stand-alone class implementation.
    };
    Constructor.prototype = new ReactCompositeComponentBase();
    Constructor.prototype.constructor = Constructor;

    injectedMixins.forEach(
      mixSpecIntoComponent.bind(null, Constructor)
    );

    mixSpecIntoComponent(Constructor, spec);

    // Initialize the defaultProps property after all mixins have been merged
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    ("production" !== process.env.NODE_ENV ? invariant(
      Constructor.prototype.render,
      'createClass(...): Class specification must implement a `render` method.'
    ) : invariant(Constructor.prototype.render));

    if ("production" !== process.env.NODE_ENV) {
      if (Constructor.prototype.componentShouldUpdate) {
        monitorCodeUse(
          'react_component_should_update_warning',
          { component: spec.displayName }
        );
        console.warn(
          (spec.displayName || 'A component') + ' has a method called ' +
          'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
          'The name is phrased as a question because the function is ' +
          'expected to return a value.'
         );
      }
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactCompositeComponentInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    if ("production" !== process.env.NODE_ENV) {
      return ReactLegacyElement.wrapFactory(
        ReactElementValidator.createFactory(Constructor)
      );
    }
    return ReactLegacyElement.wrapFactory(
      ReactElement.createFactory(Constructor)
    );
  },

  injection: {
    injectMixin: function(mixin) {
      injectedMixins.push(mixin);
    }
  }
};

module.exports = ReactCompositeComponent;

}).call(this,require('_process'))
},{"./Object.assign":59,"./ReactComponent":65,"./ReactContext":68,"./ReactCurrentOwner":69,"./ReactElement":85,"./ReactElementValidator":86,"./ReactEmptyComponent":87,"./ReactErrorUtils":88,"./ReactLegacyElement":94,"./ReactOwner":100,"./ReactPerf":101,"./ReactPropTransferer":102,"./ReactPropTypeLocationNames":103,"./ReactPropTypeLocations":104,"./ReactUpdates":112,"./instantiateReactComponent":159,"./invariant":160,"./keyMirror":166,"./keyOf":167,"./mapObject":168,"./monitorCodeUse":170,"./shouldUpdateReactComponent":176,"./warning":179,"_process":28}],68:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactContext
 */

"use strict";

var assign = require("./Object.assign");

/**
 * Keeps track of the current context.
 *
 * The context is automatically passed down the component ownership hierarchy
 * and is accessible via `this.context` on ReactCompositeComponents.
 */
var ReactContext = {

  /**
   * @internal
   * @type {object}
   */
  current: {},

  /**
   * Temporarily extends the current context while executing scopedCallback.
   *
   * A typical use case might look like
   *
   *  render: function() {
   *    var children = ReactContext.withContext({foo: 'foo'}, () => (
   *
   *    ));
   *    return <div>{children}</div>;
   *  }
   *
   * @param {object} newContext New context to merge into the existing context
   * @param {function} scopedCallback Callback to run with the new context
   * @return {ReactComponent|array<ReactComponent>}
   */
  withContext: function(newContext, scopedCallback) {
    var result;
    var previousContext = ReactContext.current;
    ReactContext.current = assign({}, previousContext, newContext);
    try {
      result = scopedCallback();
    } finally {
      ReactContext.current = previousContext;
    }
    return result;
  }

};

module.exports = ReactContext;

},{"./Object.assign":59}],69:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactCurrentOwner
 */

"use strict";

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 *
 * The depth indicate how many composite components are above this render level.
 */
var ReactCurrentOwner = {

  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null

};

module.exports = ReactCurrentOwner;

},{}],70:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOM
 * @typechecks static-only
 */

"use strict";

var ReactElement = require("./ReactElement");
var ReactElementValidator = require("./ReactElementValidator");
var ReactLegacyElement = require("./ReactLegacyElement");

var mapObject = require("./mapObject");

/**
 * Create a factory that creates HTML tag elements.
 *
 * @param {string} tag Tag name (e.g. `div`).
 * @private
 */
function createDOMFactory(tag) {
  if ("production" !== process.env.NODE_ENV) {
    return ReactLegacyElement.markNonLegacyFactory(
      ReactElementValidator.createFactory(tag)
    );
  }
  return ReactLegacyElement.markNonLegacyFactory(
    ReactElement.createFactory(tag)
  );
}

/**
 * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
 * This is also accessible via `React.DOM`.
 *
 * @public
 */
var ReactDOM = mapObject({
  a: 'a',
  abbr: 'abbr',
  address: 'address',
  area: 'area',
  article: 'article',
  aside: 'aside',
  audio: 'audio',
  b: 'b',
  base: 'base',
  bdi: 'bdi',
  bdo: 'bdo',
  big: 'big',
  blockquote: 'blockquote',
  body: 'body',
  br: 'br',
  button: 'button',
  canvas: 'canvas',
  caption: 'caption',
  cite: 'cite',
  code: 'code',
  col: 'col',
  colgroup: 'colgroup',
  data: 'data',
  datalist: 'datalist',
  dd: 'dd',
  del: 'del',
  details: 'details',
  dfn: 'dfn',
  dialog: 'dialog',
  div: 'div',
  dl: 'dl',
  dt: 'dt',
  em: 'em',
  embed: 'embed',
  fieldset: 'fieldset',
  figcaption: 'figcaption',
  figure: 'figure',
  footer: 'footer',
  form: 'form',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  head: 'head',
  header: 'header',
  hr: 'hr',
  html: 'html',
  i: 'i',
  iframe: 'iframe',
  img: 'img',
  input: 'input',
  ins: 'ins',
  kbd: 'kbd',
  keygen: 'keygen',
  label: 'label',
  legend: 'legend',
  li: 'li',
  link: 'link',
  main: 'main',
  map: 'map',
  mark: 'mark',
  menu: 'menu',
  menuitem: 'menuitem',
  meta: 'meta',
  meter: 'meter',
  nav: 'nav',
  noscript: 'noscript',
  object: 'object',
  ol: 'ol',
  optgroup: 'optgroup',
  option: 'option',
  output: 'output',
  p: 'p',
  param: 'param',
  picture: 'picture',
  pre: 'pre',
  progress: 'progress',
  q: 'q',
  rp: 'rp',
  rt: 'rt',
  ruby: 'ruby',
  s: 's',
  samp: 'samp',
  script: 'script',
  section: 'section',
  select: 'select',
  small: 'small',
  source: 'source',
  span: 'span',
  strong: 'strong',
  style: 'style',
  sub: 'sub',
  summary: 'summary',
  sup: 'sup',
  table: 'table',
  tbody: 'tbody',
  td: 'td',
  textarea: 'textarea',
  tfoot: 'tfoot',
  th: 'th',
  thead: 'thead',
  time: 'time',
  title: 'title',
  tr: 'tr',
  track: 'track',
  u: 'u',
  ul: 'ul',
  'var': 'var',
  video: 'video',
  wbr: 'wbr',

  // SVG
  circle: 'circle',
  defs: 'defs',
  ellipse: 'ellipse',
  g: 'g',
  line: 'line',
  linearGradient: 'linearGradient',
  mask: 'mask',
  path: 'path',
  pattern: 'pattern',
  polygon: 'polygon',
  polyline: 'polyline',
  radialGradient: 'radialGradient',
  rect: 'rect',
  stop: 'stop',
  svg: 'svg',
  text: 'text',
  tspan: 'tspan'

}, createDOMFactory);

module.exports = ReactDOM;

}).call(this,require('_process'))
},{"./ReactElement":85,"./ReactElementValidator":86,"./ReactLegacyElement":94,"./mapObject":168,"_process":28}],71:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMButton
 */

"use strict";

var AutoFocusMixin = require("./AutoFocusMixin");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");
var ReactDOM = require("./ReactDOM");

var keyMirror = require("./keyMirror");

// Store a reference to the <button> `ReactDOMComponent`. TODO: use string
var button = ReactElement.createFactory(ReactDOM.button.type);

var mouseListenerNames = keyMirror({
  onClick: true,
  onDoubleClick: true,
  onMouseDown: true,
  onMouseMove: true,
  onMouseUp: true,
  onClickCapture: true,
  onDoubleClickCapture: true,
  onMouseDownCapture: true,
  onMouseMoveCapture: true,
  onMouseUpCapture: true
});

/**
 * Implements a <button> native component that does not receive mouse events
 * when `disabled` is set.
 */
var ReactDOMButton = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMButton',

  mixins: [AutoFocusMixin, ReactBrowserComponentMixin],

  render: function() {
    var props = {};

    // Copy the props; except the mouse listeners if we're disabled
    for (var key in this.props) {
      if (this.props.hasOwnProperty(key) &&
          (!this.props.disabled || !mouseListenerNames[key])) {
        props[key] = this.props[key];
      }
    }

    return button(props, this.props.children);
  }

});

module.exports = ReactDOMButton;

},{"./AutoFocusMixin":34,"./ReactBrowserComponentMixin":62,"./ReactCompositeComponent":67,"./ReactDOM":70,"./ReactElement":85,"./keyMirror":166}],72:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMComponent
 * @typechecks static-only
 */

"use strict";

var CSSPropertyOperations = require("./CSSPropertyOperations");
var DOMProperty = require("./DOMProperty");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactComponent = require("./ReactComponent");
var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
var ReactMount = require("./ReactMount");
var ReactMultiChild = require("./ReactMultiChild");
var ReactPerf = require("./ReactPerf");

var assign = require("./Object.assign");
var escapeTextForBrowser = require("./escapeTextForBrowser");
var invariant = require("./invariant");
var isEventSupported = require("./isEventSupported");
var keyOf = require("./keyOf");
var monitorCodeUse = require("./monitorCodeUse");

var deleteListener = ReactBrowserEventEmitter.deleteListener;
var listenTo = ReactBrowserEventEmitter.listenTo;
var registrationNameModules = ReactBrowserEventEmitter.registrationNameModules;

// For quickly matching children type, to test if can be treated as content.
var CONTENT_TYPES = {'string': true, 'number': true};

var STYLE = keyOf({style: null});

var ELEMENT_NODE_TYPE = 1;

/**
 * @param {?object} props
 */
function assertValidProps(props) {
  if (!props) {
    return;
  }
  // Note the use of `==` which checks for null or undefined.
  ("production" !== process.env.NODE_ENV ? invariant(
    props.children == null || props.dangerouslySetInnerHTML == null,
    'Can only set one of `children` or `props.dangerouslySetInnerHTML`.'
  ) : invariant(props.children == null || props.dangerouslySetInnerHTML == null));
  if ("production" !== process.env.NODE_ENV) {
    if (props.contentEditable && props.children != null) {
      console.warn(
        'A component is `contentEditable` and contains `children` managed by ' +
        'React. It is now your responsibility to guarantee that none of those '+
        'nodes are unexpectedly modified or duplicated. This is probably not ' +
        'intentional.'
      );
    }
  }
  ("production" !== process.env.NODE_ENV ? invariant(
    props.style == null || typeof props.style === 'object',
    'The `style` prop expects a mapping from style properties to values, ' +
    'not a string.'
  ) : invariant(props.style == null || typeof props.style === 'object'));
}

function putListener(id, registrationName, listener, transaction) {
  if ("production" !== process.env.NODE_ENV) {
    // IE8 has no API for event capturing and the `onScroll` event doesn't
    // bubble.
    if (registrationName === 'onScroll' &&
        !isEventSupported('scroll', true)) {
      monitorCodeUse('react_no_scroll_event');
      console.warn('This browser doesn\'t support the `onScroll` event');
    }
  }
  var container = ReactMount.findReactContainerForID(id);
  if (container) {
    var doc = container.nodeType === ELEMENT_NODE_TYPE ?
      container.ownerDocument :
      container;
    listenTo(registrationName, doc);
  }
  transaction.getPutListenerQueue().enqueuePutListener(
    id,
    registrationName,
    listener
  );
}

// For HTML, certain tags should omit their close tag. We keep a whitelist for
// those special cased tags.

var omittedCloseTags = {
  'area': true,
  'base': true,
  'br': true,
  'col': true,
  'embed': true,
  'hr': true,
  'img': true,
  'input': true,
  'keygen': true,
  'link': true,
  'meta': true,
  'param': true,
  'source': true,
  'track': true,
  'wbr': true
  // NOTE: menuitem's close tag should be omitted, but that causes problems.
};

// We accept any tag to be rendered but since this gets injected into abitrary
// HTML, we want to make sure that it's a safe tag.
// http://www.w3.org/TR/REC-xml/#NT-Name

var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/; // Simplified subset
var validatedTagCache = {};
var hasOwnProperty = {}.hasOwnProperty;

function validateDangerousTag(tag) {
  if (!hasOwnProperty.call(validatedTagCache, tag)) {
    ("production" !== process.env.NODE_ENV ? invariant(VALID_TAG_REGEX.test(tag), 'Invalid tag: %s', tag) : invariant(VALID_TAG_REGEX.test(tag)));
    validatedTagCache[tag] = true;
  }
}

/**
 * Creates a new React class that is idempotent and capable of containing other
 * React components. It accepts event listeners and DOM properties that are
 * valid according to `DOMProperty`.
 *
 *  - Event listeners: `onClick`, `onMouseDown`, etc.
 *  - DOM properties: `className`, `name`, `title`, etc.
 *
 * The `style` property functions differently from the DOM API. It accepts an
 * object mapping of style properties to values.
 *
 * @constructor ReactDOMComponent
 * @extends ReactComponent
 * @extends ReactMultiChild
 */
function ReactDOMComponent(tag) {
  validateDangerousTag(tag);
  this._tag = tag;
  this.tagName = tag.toUpperCase();
}

ReactDOMComponent.displayName = 'ReactDOMComponent';

ReactDOMComponent.Mixin = {

  /**
   * Generates root tag markup then recurses. This method has side effects and
   * is not idempotent.
   *
   * @internal
   * @param {string} rootID The root DOM ID for this node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {number} mountDepth number of components in the owner hierarchy
   * @return {string} The computed markup.
   */
  mountComponent: ReactPerf.measure(
    'ReactDOMComponent',
    'mountComponent',
    function(rootID, transaction, mountDepth) {
      ReactComponent.Mixin.mountComponent.call(
        this,
        rootID,
        transaction,
        mountDepth
      );
      assertValidProps(this.props);
      var closeTag = omittedCloseTags[this._tag] ? '' : '</' + this._tag + '>';
      return (
        this._createOpenTagMarkupAndPutListeners(transaction) +
        this._createContentMarkup(transaction) +
        closeTag
      );
    }
  ),

  /**
   * Creates markup for the open tag and all attributes.
   *
   * This method has side effects because events get registered.
   *
   * Iterating over object properties is faster than iterating over arrays.
   * @see http://jsperf.com/obj-vs-arr-iteration
   *
   * @private
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @return {string} Markup of opening tag.
   */
  _createOpenTagMarkupAndPutListeners: function(transaction) {
    var props = this.props;
    var ret = '<' + this._tag;

    for (var propKey in props) {
      if (!props.hasOwnProperty(propKey)) {
        continue;
      }
      var propValue = props[propKey];
      if (propValue == null) {
        continue;
      }
      if (registrationNameModules.hasOwnProperty(propKey)) {
        putListener(this._rootNodeID, propKey, propValue, transaction);
      } else {
        if (propKey === STYLE) {
          if (propValue) {
            propValue = props.style = assign({}, props.style);
          }
          propValue = CSSPropertyOperations.createMarkupForStyles(propValue);
        }
        var markup =
          DOMPropertyOperations.createMarkupForProperty(propKey, propValue);
        if (markup) {
          ret += ' ' + markup;
        }
      }
    }

    // For static pages, no need to put React ID and checksum. Saves lots of
    // bytes.
    if (transaction.renderToStaticMarkup) {
      return ret + '>';
    }

    var markupForID = DOMPropertyOperations.createMarkupForID(this._rootNodeID);
    return ret + ' ' + markupForID + '>';
  },

  /**
   * Creates markup for the content between the tags.
   *
   * @private
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @return {string} Content markup.
   */
  _createContentMarkup: function(transaction) {
    // Intentional use of != to avoid catching zero/false.
    var innerHTML = this.props.dangerouslySetInnerHTML;
    if (innerHTML != null) {
      if (innerHTML.__html != null) {
        return innerHTML.__html;
      }
    } else {
      var contentToUse =
        CONTENT_TYPES[typeof this.props.children] ? this.props.children : null;
      var childrenToUse = contentToUse != null ? null : this.props.children;
      if (contentToUse != null) {
        return escapeTextForBrowser(contentToUse);
      } else if (childrenToUse != null) {
        var mountImages = this.mountChildren(
          childrenToUse,
          transaction
        );
        return mountImages.join('');
      }
    }
    return '';
  },

  receiveComponent: function(nextElement, transaction) {
    if (nextElement === this._currentElement &&
        nextElement._owner != null) {
      // Since elements are immutable after the owner is rendered,
      // we can do a cheap identity compare here to determine if this is a
      // superfluous reconcile. It's possible for state to be mutable but such
      // change should trigger an update of the owner which would recreate
      // the element. We explicitly check for the existence of an owner since
      // it's possible for a element created outside a composite to be
      // deeply mutated and reused.
      return;
    }

    ReactComponent.Mixin.receiveComponent.call(
      this,
      nextElement,
      transaction
    );
  },

  /**
   * Updates a native DOM component after it has already been allocated and
   * attached to the DOM. Reconciles the root DOM node, then recurses.
   *
   * @param {ReactReconcileTransaction} transaction
   * @param {ReactElement} prevElement
   * @internal
   * @overridable
   */
  updateComponent: ReactPerf.measure(
    'ReactDOMComponent',
    'updateComponent',
    function(transaction, prevElement) {
      assertValidProps(this._currentElement.props);
      ReactComponent.Mixin.updateComponent.call(
        this,
        transaction,
        prevElement
      );
      this._updateDOMProperties(prevElement.props, transaction);
      this._updateDOMChildren(prevElement.props, transaction);
    }
  ),

  /**
   * Reconciles the properties by detecting differences in property values and
   * updating the DOM as necessary. This function is probably the single most
   * critical path for performance optimization.
   *
   * TODO: Benchmark whether checking for changed values in memory actually
   *       improves performance (especially statically positioned elements).
   * TODO: Benchmark the effects of putting this at the top since 99% of props
   *       do not change for a given reconciliation.
   * TODO: Benchmark areas that can be improved with caching.
   *
   * @private
   * @param {object} lastProps
   * @param {ReactReconcileTransaction} transaction
   */
  _updateDOMProperties: function(lastProps, transaction) {
    var nextProps = this.props;
    var propKey;
    var styleName;
    var styleUpdates;
    for (propKey in lastProps) {
      if (nextProps.hasOwnProperty(propKey) ||
         !lastProps.hasOwnProperty(propKey)) {
        continue;
      }
      if (propKey === STYLE) {
        var lastStyle = lastProps[propKey];
        for (styleName in lastStyle) {
          if (lastStyle.hasOwnProperty(styleName)) {
            styleUpdates = styleUpdates || {};
            styleUpdates[styleName] = '';
          }
        }
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        deleteListener(this._rootNodeID, propKey);
      } else if (
          DOMProperty.isStandardName[propKey] ||
          DOMProperty.isCustomAttribute(propKey)) {
        ReactComponent.BackendIDOperations.deletePropertyByID(
          this._rootNodeID,
          propKey
        );
      }
    }
    for (propKey in nextProps) {
      var nextProp = nextProps[propKey];
      var lastProp = lastProps[propKey];
      if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp) {
        continue;
      }
      if (propKey === STYLE) {
        if (nextProp) {
          nextProp = nextProps.style = assign({}, nextProp);
        }
        if (lastProp) {
          // Unset styles on `lastProp` but not on `nextProp`.
          for (styleName in lastProp) {
            if (lastProp.hasOwnProperty(styleName) &&
                (!nextProp || !nextProp.hasOwnProperty(styleName))) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = '';
            }
          }
          // Update styles that changed since `lastProp`.
          for (styleName in nextProp) {
            if (nextProp.hasOwnProperty(styleName) &&
                lastProp[styleName] !== nextProp[styleName]) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = nextProp[styleName];
            }
          }
        } else {
          // Relies on `updateStylesByID` not mutating `styleUpdates`.
          styleUpdates = nextProp;
        }
      } else if (registrationNameModules.hasOwnProperty(propKey)) {
        putListener(this._rootNodeID, propKey, nextProp, transaction);
      } else if (
          DOMProperty.isStandardName[propKey] ||
          DOMProperty.isCustomAttribute(propKey)) {
        ReactComponent.BackendIDOperations.updatePropertyByID(
          this._rootNodeID,
          propKey,
          nextProp
        );
      }
    }
    if (styleUpdates) {
      ReactComponent.BackendIDOperations.updateStylesByID(
        this._rootNodeID,
        styleUpdates
      );
    }
  },

  /**
   * Reconciles the children with the various properties that affect the
   * children content.
   *
   * @param {object} lastProps
   * @param {ReactReconcileTransaction} transaction
   */
  _updateDOMChildren: function(lastProps, transaction) {
    var nextProps = this.props;

    var lastContent =
      CONTENT_TYPES[typeof lastProps.children] ? lastProps.children : null;
    var nextContent =
      CONTENT_TYPES[typeof nextProps.children] ? nextProps.children : null;

    var lastHtml =
      lastProps.dangerouslySetInnerHTML &&
      lastProps.dangerouslySetInnerHTML.__html;
    var nextHtml =
      nextProps.dangerouslySetInnerHTML &&
      nextProps.dangerouslySetInnerHTML.__html;

    // Note the use of `!=` which checks for null or undefined.
    var lastChildren = lastContent != null ? null : lastProps.children;
    var nextChildren = nextContent != null ? null : nextProps.children;

    // If we're switching from children to content/html or vice versa, remove
    // the old content
    var lastHasContentOrHtml = lastContent != null || lastHtml != null;
    var nextHasContentOrHtml = nextContent != null || nextHtml != null;
    if (lastChildren != null && nextChildren == null) {
      this.updateChildren(null, transaction);
    } else if (lastHasContentOrHtml && !nextHasContentOrHtml) {
      this.updateTextContent('');
    }

    if (nextContent != null) {
      if (lastContent !== nextContent) {
        this.updateTextContent('' + nextContent);
      }
    } else if (nextHtml != null) {
      if (lastHtml !== nextHtml) {
        ReactComponent.BackendIDOperations.updateInnerHTMLByID(
          this._rootNodeID,
          nextHtml
        );
      }
    } else if (nextChildren != null) {
      this.updateChildren(nextChildren, transaction);
    }
  },

  /**
   * Destroys all event registrations for this instance. Does not remove from
   * the DOM. That must be done by the parent.
   *
   * @internal
   */
  unmountComponent: function() {
    this.unmountChildren();
    ReactBrowserEventEmitter.deleteAllListeners(this._rootNodeID);
    ReactComponent.Mixin.unmountComponent.call(this);
  }

};

assign(
  ReactDOMComponent.prototype,
  ReactComponent.Mixin,
  ReactDOMComponent.Mixin,
  ReactMultiChild.Mixin,
  ReactBrowserComponentMixin
);

module.exports = ReactDOMComponent;

}).call(this,require('_process'))
},{"./CSSPropertyOperations":37,"./DOMProperty":43,"./DOMPropertyOperations":44,"./Object.assign":59,"./ReactBrowserComponentMixin":62,"./ReactBrowserEventEmitter":63,"./ReactComponent":65,"./ReactMount":96,"./ReactMultiChild":97,"./ReactPerf":101,"./escapeTextForBrowser":143,"./invariant":160,"./isEventSupported":161,"./keyOf":167,"./monitorCodeUse":170,"_process":28}],73:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMForm
 */

"use strict";

var EventConstants = require("./EventConstants");
var LocalEventTrapMixin = require("./LocalEventTrapMixin");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");
var ReactDOM = require("./ReactDOM");

// Store a reference to the <form> `ReactDOMComponent`. TODO: use string
var form = ReactElement.createFactory(ReactDOM.form.type);

/**
 * Since onSubmit doesn't bubble OR capture on the top level in IE8, we need
 * to capture it on the <form> element itself. There are lots of hacks we could
 * do to accomplish this, but the most reliable is to make <form> a
 * composite component and use `componentDidMount` to attach the event handlers.
 */
var ReactDOMForm = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMForm',

  mixins: [ReactBrowserComponentMixin, LocalEventTrapMixin],

  render: function() {
    // TODO: Instead of using `ReactDOM` directly, we should use JSX. However,
    // `jshint` fails to parse JSX so in order for linting to work in the open
    // source repo, we need to just use `ReactDOM.form`.
    return form(this.props);
  },

  componentDidMount: function() {
    this.trapBubbledEvent(EventConstants.topLevelTypes.topReset, 'reset');
    this.trapBubbledEvent(EventConstants.topLevelTypes.topSubmit, 'submit');
  }
});

module.exports = ReactDOMForm;

},{"./EventConstants":48,"./LocalEventTrapMixin":57,"./ReactBrowserComponentMixin":62,"./ReactCompositeComponent":67,"./ReactDOM":70,"./ReactElement":85}],74:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMIDOperations
 * @typechecks static-only
 */

/*jslint evil: true */

"use strict";

var CSSPropertyOperations = require("./CSSPropertyOperations");
var DOMChildrenOperations = require("./DOMChildrenOperations");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var ReactMount = require("./ReactMount");
var ReactPerf = require("./ReactPerf");

var invariant = require("./invariant");
var setInnerHTML = require("./setInnerHTML");

/**
 * Errors for properties that should not be updated with `updatePropertyById()`.
 *
 * @type {object}
 * @private
 */
var INVALID_PROPERTY_ERRORS = {
  dangerouslySetInnerHTML:
    '`dangerouslySetInnerHTML` must be set using `updateInnerHTMLByID()`.',
  style: '`style` must be set using `updateStylesByID()`.'
};

/**
 * Operations used to process updates to DOM nodes. This is made injectable via
 * `ReactComponent.BackendIDOperations`.
 */
var ReactDOMIDOperations = {

  /**
   * Updates a DOM node with new property values. This should only be used to
   * update DOM properties in `DOMProperty`.
   *
   * @param {string} id ID of the node to update.
   * @param {string} name A valid property name, see `DOMProperty`.
   * @param {*} value New value of the property.
   * @internal
   */
  updatePropertyByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'updatePropertyByID',
    function(id, name, value) {
      var node = ReactMount.getNode(id);
      ("production" !== process.env.NODE_ENV ? invariant(
        !INVALID_PROPERTY_ERRORS.hasOwnProperty(name),
        'updatePropertyByID(...): %s',
        INVALID_PROPERTY_ERRORS[name]
      ) : invariant(!INVALID_PROPERTY_ERRORS.hasOwnProperty(name)));

      // If we're updating to null or undefined, we should remove the property
      // from the DOM node instead of inadvertantly setting to a string. This
      // brings us in line with the same behavior we have on initial render.
      if (value != null) {
        DOMPropertyOperations.setValueForProperty(node, name, value);
      } else {
        DOMPropertyOperations.deleteValueForProperty(node, name);
      }
    }
  ),

  /**
   * Updates a DOM node to remove a property. This should only be used to remove
   * DOM properties in `DOMProperty`.
   *
   * @param {string} id ID of the node to update.
   * @param {string} name A property name to remove, see `DOMProperty`.
   * @internal
   */
  deletePropertyByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'deletePropertyByID',
    function(id, name, value) {
      var node = ReactMount.getNode(id);
      ("production" !== process.env.NODE_ENV ? invariant(
        !INVALID_PROPERTY_ERRORS.hasOwnProperty(name),
        'updatePropertyByID(...): %s',
        INVALID_PROPERTY_ERRORS[name]
      ) : invariant(!INVALID_PROPERTY_ERRORS.hasOwnProperty(name)));
      DOMPropertyOperations.deleteValueForProperty(node, name, value);
    }
  ),

  /**
   * Updates a DOM node with new style values. If a value is specified as '',
   * the corresponding style property will be unset.
   *
   * @param {string} id ID of the node to update.
   * @param {object} styles Mapping from styles to values.
   * @internal
   */
  updateStylesByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'updateStylesByID',
    function(id, styles) {
      var node = ReactMount.getNode(id);
      CSSPropertyOperations.setValueForStyles(node, styles);
    }
  ),

  /**
   * Updates a DOM node's innerHTML.
   *
   * @param {string} id ID of the node to update.
   * @param {string} html An HTML string.
   * @internal
   */
  updateInnerHTMLByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'updateInnerHTMLByID',
    function(id, html) {
      var node = ReactMount.getNode(id);
      setInnerHTML(node, html);
    }
  ),

  /**
   * Updates a DOM node's text content set by `props.content`.
   *
   * @param {string} id ID of the node to update.
   * @param {string} content Text content.
   * @internal
   */
  updateTextContentByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'updateTextContentByID',
    function(id, content) {
      var node = ReactMount.getNode(id);
      DOMChildrenOperations.updateTextContent(node, content);
    }
  ),

  /**
   * Replaces a DOM node that exists in the document with markup.
   *
   * @param {string} id ID of child to be replaced.
   * @param {string} markup Dangerous markup to inject in place of child.
   * @internal
   * @see {Danger.dangerouslyReplaceNodeWithMarkup}
   */
  dangerouslyReplaceNodeWithMarkupByID: ReactPerf.measure(
    'ReactDOMIDOperations',
    'dangerouslyReplaceNodeWithMarkupByID',
    function(id, markup) {
      var node = ReactMount.getNode(id);
      DOMChildrenOperations.dangerouslyReplaceNodeWithMarkup(node, markup);
    }
  ),

  /**
   * Updates a component's children by processing a series of updates.
   *
   * @param {array<object>} updates List of update configurations.
   * @param {array<string>} markup List of markup strings.
   * @internal
   */
  dangerouslyProcessChildrenUpdates: ReactPerf.measure(
    'ReactDOMIDOperations',
    'dangerouslyProcessChildrenUpdates',
    function(updates, markup) {
      for (var i = 0; i < updates.length; i++) {
        updates[i].parentNode = ReactMount.getNode(updates[i].parentID);
      }
      DOMChildrenOperations.processUpdates(updates, markup);
    }
  )
};

module.exports = ReactDOMIDOperations;

}).call(this,require('_process'))
},{"./CSSPropertyOperations":37,"./DOMChildrenOperations":42,"./DOMPropertyOperations":44,"./ReactMount":96,"./ReactPerf":101,"./invariant":160,"./setInnerHTML":174,"_process":28}],75:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMImg
 */

"use strict";

var EventConstants = require("./EventConstants");
var LocalEventTrapMixin = require("./LocalEventTrapMixin");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");
var ReactDOM = require("./ReactDOM");

// Store a reference to the <img> `ReactDOMComponent`. TODO: use string
var img = ReactElement.createFactory(ReactDOM.img.type);

/**
 * Since onLoad doesn't bubble OR capture on the top level in IE8, we need to
 * capture it on the <img> element itself. There are lots of hacks we could do
 * to accomplish this, but the most reliable is to make <img> a composite
 * component and use `componentDidMount` to attach the event handlers.
 */
var ReactDOMImg = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMImg',
  tagName: 'IMG',

  mixins: [ReactBrowserComponentMixin, LocalEventTrapMixin],

  render: function() {
    return img(this.props);
  },

  componentDidMount: function() {
    this.trapBubbledEvent(EventConstants.topLevelTypes.topLoad, 'load');
    this.trapBubbledEvent(EventConstants.topLevelTypes.topError, 'error');
  }
});

module.exports = ReactDOMImg;

},{"./EventConstants":48,"./LocalEventTrapMixin":57,"./ReactBrowserComponentMixin":62,"./ReactCompositeComponent":67,"./ReactDOM":70,"./ReactElement":85}],76:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMInput
 */

"use strict";

var AutoFocusMixin = require("./AutoFocusMixin");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var LinkedValueUtils = require("./LinkedValueUtils");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");
var ReactDOM = require("./ReactDOM");
var ReactMount = require("./ReactMount");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");
var invariant = require("./invariant");

// Store a reference to the <input> `ReactDOMComponent`. TODO: use string
var input = ReactElement.createFactory(ReactDOM.input.type);

var instancesByReactID = {};

function forceUpdateIfMounted() {
  /*jshint validthis:true */
  if (this.isMounted()) {
    this.forceUpdate();
  }
}

/**
 * Implements an <input> native component that allows setting these optional
 * props: `checked`, `value`, `defaultChecked`, and `defaultValue`.
 *
 * If `checked` or `value` are not supplied (or null/undefined), user actions
 * that affect the checked state or value will trigger updates to the element.
 *
 * If they are supplied (and not null/undefined), the rendered element will not
 * trigger updates to the element. Instead, the props must change in order for
 * the rendered element to be updated.
 *
 * The rendered element will be initialized as unchecked (or `defaultChecked`)
 * with an empty value (or `defaultValue`).
 *
 * @see http://www.w3.org/TR/2012/WD-html5-20121025/the-input-element.html
 */
var ReactDOMInput = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMInput',

  mixins: [AutoFocusMixin, LinkedValueUtils.Mixin, ReactBrowserComponentMixin],

  getInitialState: function() {
    var defaultValue = this.props.defaultValue;
    return {
      initialChecked: this.props.defaultChecked || false,
      initialValue: defaultValue != null ? defaultValue : null
    };
  },

  render: function() {
    // Clone `this.props` so we don't mutate the input.
    var props = assign({}, this.props);

    props.defaultChecked = null;
    props.defaultValue = null;

    var value = LinkedValueUtils.getValue(this);
    props.value = value != null ? value : this.state.initialValue;

    var checked = LinkedValueUtils.getChecked(this);
    props.checked = checked != null ? checked : this.state.initialChecked;

    props.onChange = this._handleChange;

    return input(props, this.props.children);
  },

  componentDidMount: function() {
    var id = ReactMount.getID(this.getDOMNode());
    instancesByReactID[id] = this;
  },

  componentWillUnmount: function() {
    var rootNode = this.getDOMNode();
    var id = ReactMount.getID(rootNode);
    delete instancesByReactID[id];
  },

  componentDidUpdate: function(prevProps, prevState, prevContext) {
    var rootNode = this.getDOMNode();
    if (this.props.checked != null) {
      DOMPropertyOperations.setValueForProperty(
        rootNode,
        'checked',
        this.props.checked || false
      );
    }

    var value = LinkedValueUtils.getValue(this);
    if (value != null) {
      // Cast `value` to a string to ensure the value is set correctly. While
      // browsers typically do this as necessary, jsdom doesn't.
      DOMPropertyOperations.setValueForProperty(rootNode, 'value', '' + value);
    }
  },

  _handleChange: function(event) {
    var returnValue;
    var onChange = LinkedValueUtils.getOnChange(this);
    if (onChange) {
      returnValue = onChange.call(this, event);
    }
    // Here we use asap to wait until all updates have propagated, which
    // is important when using controlled components within layers:
    // https://github.com/facebook/react/issues/1698
    ReactUpdates.asap(forceUpdateIfMounted, this);

    var name = this.props.name;
    if (this.props.type === 'radio' && name != null) {
      var rootNode = this.getDOMNode();
      var queryRoot = rootNode;

      while (queryRoot.parentNode) {
        queryRoot = queryRoot.parentNode;
      }

      // If `rootNode.form` was non-null, then we could try `form.elements`,
      // but that sometimes behaves strangely in IE8. We could also try using
      // `form.getElementsByName`, but that will only return direct children
      // and won't include inputs that use the HTML5 `form=` attribute. Since
      // the input might not even be in a form, let's just use the global
      // `querySelectorAll` to ensure we don't miss anything.
      var group = queryRoot.querySelectorAll(
        'input[name=' + JSON.stringify('' + name) + '][type="radio"]');

      for (var i = 0, groupLen = group.length; i < groupLen; i++) {
        var otherNode = group[i];
        if (otherNode === rootNode ||
            otherNode.form !== rootNode.form) {
          continue;
        }
        var otherID = ReactMount.getID(otherNode);
        ("production" !== process.env.NODE_ENV ? invariant(
          otherID,
          'ReactDOMInput: Mixing React and non-React radio inputs with the ' +
          'same `name` is not supported.'
        ) : invariant(otherID));
        var otherInstance = instancesByReactID[otherID];
        ("production" !== process.env.NODE_ENV ? invariant(
          otherInstance,
          'ReactDOMInput: Unknown radio button ID %s.',
          otherID
        ) : invariant(otherInstance));
        // If this is a controlled radio button group, forcing the input that
        // was previously checked to update will cause it to be come re-checked
        // as appropriate.
        ReactUpdates.asap(forceUpdateIfMounted, otherInstance);
      }
    }

    return returnValue;
  }

});

module.exports = ReactDOMInput;

}).call(this,require('_process'))
},{"./AutoFocusMixin":34,"./DOMPropertyOperations":44,"./LinkedValueUtils":56,"./Object.assign":59,"./ReactBrowserComponentMixin":62,"./ReactCompositeComponent":67,"./ReactDOM":70,"./ReactElement":85,"./ReactMount":96,"./ReactUpdates":112,"./invariant":160,"_process":28}],77:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMOption
 */

"use strict";

var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");
var ReactDOM = require("./ReactDOM");

var warning = require("./warning");

// Store a reference to the <option> `ReactDOMComponent`. TODO: use string
var option = ReactElement.createFactory(ReactDOM.option.type);

/**
 * Implements an <option> native component that warns when `selected` is set.
 */
var ReactDOMOption = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMOption',

  mixins: [ReactBrowserComponentMixin],

  componentWillMount: function() {
    // TODO (yungsters): Remove support for `selected` in <option>.
    if ("production" !== process.env.NODE_ENV) {
      ("production" !== process.env.NODE_ENV ? warning(
        this.props.selected == null,
        'Use the `defaultValue` or `value` props on <select> instead of ' +
        'setting `selected` on <option>.'
      ) : null);
    }
  },

  render: function() {
    return option(this.props, this.props.children);
  }

});

module.exports = ReactDOMOption;

}).call(this,require('_process'))
},{"./ReactBrowserComponentMixin":62,"./ReactCompositeComponent":67,"./ReactDOM":70,"./ReactElement":85,"./warning":179,"_process":28}],78:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMSelect
 */

"use strict";

var AutoFocusMixin = require("./AutoFocusMixin");
var LinkedValueUtils = require("./LinkedValueUtils");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");
var ReactDOM = require("./ReactDOM");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");

// Store a reference to the <select> `ReactDOMComponent`. TODO: use string
var select = ReactElement.createFactory(ReactDOM.select.type);

function updateWithPendingValueIfMounted() {
  /*jshint validthis:true */
  if (this.isMounted()) {
    this.setState({value: this._pendingValue});
    this._pendingValue = 0;
  }
}

/**
 * Validation function for `value` and `defaultValue`.
 * @private
 */
function selectValueType(props, propName, componentName) {
  if (props[propName] == null) {
    return;
  }
  if (props.multiple) {
    if (!Array.isArray(props[propName])) {
      return new Error(
        ("The `" + propName + "` prop supplied to <select> must be an array if ") +
        ("`multiple` is true.")
      );
    }
  } else {
    if (Array.isArray(props[propName])) {
      return new Error(
        ("The `" + propName + "` prop supplied to <select> must be a scalar ") +
        ("value if `multiple` is false.")
      );
    }
  }
}

/**
 * If `value` is supplied, updates <option> elements on mount and update.
 * @param {ReactComponent} component Instance of ReactDOMSelect
 * @param {?*} propValue For uncontrolled components, null/undefined. For
 * controlled components, a string (or with `multiple`, a list of strings).
 * @private
 */
function updateOptions(component, propValue) {
  var multiple = component.props.multiple;
  var value = propValue != null ? propValue : component.state.value;
  var options = component.getDOMNode().options;
  var selectedValue, i, l;
  if (multiple) {
    selectedValue = {};
    for (i = 0, l = value.length; i < l; ++i) {
      selectedValue['' + value[i]] = true;
    }
  } else {
    selectedValue = '' + value;
  }
  for (i = 0, l = options.length; i < l; i++) {
    var selected = multiple ?
      selectedValue.hasOwnProperty(options[i].value) :
      options[i].value === selectedValue;

    if (selected !== options[i].selected) {
      options[i].selected = selected;
    }
  }
}

/**
 * Implements a <select> native component that allows optionally setting the
 * props `value` and `defaultValue`. If `multiple` is false, the prop must be a
 * string. If `multiple` is true, the prop must be an array of strings.
 *
 * If `value` is not supplied (or null/undefined), user actions that change the
 * selected option will trigger updates to the rendered options.
 *
 * If it is supplied (and not null/undefined), the rendered options will not
 * update in response to user actions. Instead, the `value` prop must change in
 * order for the rendered options to update.
 *
 * If `defaultValue` is provided, any options with the supplied values will be
 * selected.
 */
var ReactDOMSelect = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMSelect',

  mixins: [AutoFocusMixin, LinkedValueUtils.Mixin, ReactBrowserComponentMixin],

  propTypes: {
    defaultValue: selectValueType,
    value: selectValueType
  },

  getInitialState: function() {
    return {value: this.props.defaultValue || (this.props.multiple ? [] : '')};
  },

  componentWillMount: function() {
    this._pendingValue = null;
  },

  componentWillReceiveProps: function(nextProps) {
    if (!this.props.multiple && nextProps.multiple) {
      this.setState({value: [this.state.value]});
    } else if (this.props.multiple && !nextProps.multiple) {
      this.setState({value: this.state.value[0]});
    }
  },

  render: function() {
    // Clone `this.props` so we don't mutate the input.
    var props = assign({}, this.props);

    props.onChange = this._handleChange;
    props.value = null;

    return select(props, this.props.children);
  },

  componentDidMount: function() {
    updateOptions(this, LinkedValueUtils.getValue(this));
  },

  componentDidUpdate: function(prevProps) {
    var value = LinkedValueUtils.getValue(this);
    var prevMultiple = !!prevProps.multiple;
    var multiple = !!this.props.multiple;
    if (value != null || prevMultiple !== multiple) {
      updateOptions(this, value);
    }
  },

  _handleChange: function(event) {
    var returnValue;
    var onChange = LinkedValueUtils.getOnChange(this);
    if (onChange) {
      returnValue = onChange.call(this, event);
    }

    var selectedValue;
    if (this.props.multiple) {
      selectedValue = [];
      var options = event.target.options;
      for (var i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          selectedValue.push(options[i].value);
        }
      }
    } else {
      selectedValue = event.target.value;
    }

    this._pendingValue = selectedValue;
    ReactUpdates.asap(updateWithPendingValueIfMounted, this);
    return returnValue;
  }

});

module.exports = ReactDOMSelect;

},{"./AutoFocusMixin":34,"./LinkedValueUtils":56,"./Object.assign":59,"./ReactBrowserComponentMixin":62,"./ReactCompositeComponent":67,"./ReactDOM":70,"./ReactElement":85,"./ReactUpdates":112}],79:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMSelection
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var getNodeForCharacterOffset = require("./getNodeForCharacterOffset");
var getTextContentAccessor = require("./getTextContentAccessor");

/**
 * While `isCollapsed` is available on the Selection object and `collapsed`
 * is available on the Range object, IE11 sometimes gets them wrong.
 * If the anchor/focus nodes and offsets are the same, the range is collapsed.
 */
function isCollapsed(anchorNode, anchorOffset, focusNode, focusOffset) {
  return anchorNode === focusNode && anchorOffset === focusOffset;
}

/**
 * Get the appropriate anchor and focus node/offset pairs for IE.
 *
 * The catch here is that IE's selection API doesn't provide information
 * about whether the selection is forward or backward, so we have to
 * behave as though it's always forward.
 *
 * IE text differs from modern selection in that it behaves as though
 * block elements end with a new line. This means character offsets will
 * differ between the two APIs.
 *
 * @param {DOMElement} node
 * @return {object}
 */
function getIEOffsets(node) {
  var selection = document.selection;
  var selectedRange = selection.createRange();
  var selectedLength = selectedRange.text.length;

  // Duplicate selection so we can move range without breaking user selection.
  var fromStart = selectedRange.duplicate();
  fromStart.moveToElementText(node);
  fromStart.setEndPoint('EndToStart', selectedRange);

  var startOffset = fromStart.text.length;
  var endOffset = startOffset + selectedLength;

  return {
    start: startOffset,
    end: endOffset
  };
}

/**
 * @param {DOMElement} node
 * @return {?object}
 */
function getModernOffsets(node) {
  var selection = window.getSelection && window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  var anchorNode = selection.anchorNode;
  var anchorOffset = selection.anchorOffset;
  var focusNode = selection.focusNode;
  var focusOffset = selection.focusOffset;

  var currentRange = selection.getRangeAt(0);

  // If the node and offset values are the same, the selection is collapsed.
  // `Selection.isCollapsed` is available natively, but IE sometimes gets
  // this value wrong.
  var isSelectionCollapsed = isCollapsed(
    selection.anchorNode,
    selection.anchorOffset,
    selection.focusNode,
    selection.focusOffset
  );

  var rangeLength = isSelectionCollapsed ? 0 : currentRange.toString().length;

  var tempRange = currentRange.cloneRange();
  tempRange.selectNodeContents(node);
  tempRange.setEnd(currentRange.startContainer, currentRange.startOffset);

  var isTempRangeCollapsed = isCollapsed(
    tempRange.startContainer,
    tempRange.startOffset,
    tempRange.endContainer,
    tempRange.endOffset
  );

  var start = isTempRangeCollapsed ? 0 : tempRange.toString().length;
  var end = start + rangeLength;

  // Detect whether the selection is backward.
  var detectionRange = document.createRange();
  detectionRange.setStart(anchorNode, anchorOffset);
  detectionRange.setEnd(focusNode, focusOffset);
  var isBackward = detectionRange.collapsed;

  return {
    start: isBackward ? end : start,
    end: isBackward ? start : end
  };
}

/**
 * @param {DOMElement|DOMTextNode} node
 * @param {object} offsets
 */
function setIEOffsets(node, offsets) {
  var range = document.selection.createRange().duplicate();
  var start, end;

  if (typeof offsets.end === 'undefined') {
    start = offsets.start;
    end = start;
  } else if (offsets.start > offsets.end) {
    start = offsets.end;
    end = offsets.start;
  } else {
    start = offsets.start;
    end = offsets.end;
  }

  range.moveToElementText(node);
  range.moveStart('character', start);
  range.setEndPoint('EndToStart', range);
  range.moveEnd('character', end - start);
  range.select();
}

/**
 * In modern non-IE browsers, we can support both forward and backward
 * selections.
 *
 * Note: IE10+ supports the Selection object, but it does not support
 * the `extend` method, which means that even in modern IE, it's not possible
 * to programatically create a backward selection. Thus, for all IE
 * versions, we use the old IE API to create our selections.
 *
 * @param {DOMElement|DOMTextNode} node
 * @param {object} offsets
 */
function setModernOffsets(node, offsets) {
  if (!window.getSelection) {
    return;
  }

  var selection = window.getSelection();
  var length = node[getTextContentAccessor()].length;
  var start = Math.min(offsets.start, length);
  var end = typeof offsets.end === 'undefined' ?
            start : Math.min(offsets.end, length);

  // IE 11 uses modern selection, but doesn't support the extend method.
  // Flip backward selections, so we can set with a single range.
  if (!selection.extend && start > end) {
    var temp = end;
    end = start;
    start = temp;
  }

  var startMarker = getNodeForCharacterOffset(node, start);
  var endMarker = getNodeForCharacterOffset(node, end);

  if (startMarker && endMarker) {
    var range = document.createRange();
    range.setStart(startMarker.node, startMarker.offset);
    selection.removeAllRanges();

    if (start > end) {
      selection.addRange(range);
      selection.extend(endMarker.node, endMarker.offset);
    } else {
      range.setEnd(endMarker.node, endMarker.offset);
      selection.addRange(range);
    }
  }
}

var useIEOffsets = ExecutionEnvironment.canUseDOM && document.selection;

var ReactDOMSelection = {
  /**
   * @param {DOMElement} node
   */
  getOffsets: useIEOffsets ? getIEOffsets : getModernOffsets,

  /**
   * @param {DOMElement|DOMTextNode} node
   * @param {object} offsets
   */
  setOffsets: useIEOffsets ? setIEOffsets : setModernOffsets
};

module.exports = ReactDOMSelection;

},{"./ExecutionEnvironment":54,"./getNodeForCharacterOffset":153,"./getTextContentAccessor":155}],80:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMTextarea
 */

"use strict";

var AutoFocusMixin = require("./AutoFocusMixin");
var DOMPropertyOperations = require("./DOMPropertyOperations");
var LinkedValueUtils = require("./LinkedValueUtils");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");
var ReactDOM = require("./ReactDOM");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");
var invariant = require("./invariant");

var warning = require("./warning");

// Store a reference to the <textarea> `ReactDOMComponent`. TODO: use string
var textarea = ReactElement.createFactory(ReactDOM.textarea.type);

function forceUpdateIfMounted() {
  /*jshint validthis:true */
  if (this.isMounted()) {
    this.forceUpdate();
  }
}

/**
 * Implements a <textarea> native component that allows setting `value`, and
 * `defaultValue`. This differs from the traditional DOM API because value is
 * usually set as PCDATA children.
 *
 * If `value` is not supplied (or null/undefined), user actions that affect the
 * value will trigger updates to the element.
 *
 * If `value` is supplied (and not null/undefined), the rendered element will
 * not trigger updates to the element. Instead, the `value` prop must change in
 * order for the rendered element to be updated.
 *
 * The rendered element will be initialized with an empty value, the prop
 * `defaultValue` if specified, or the children content (deprecated).
 */
var ReactDOMTextarea = ReactCompositeComponent.createClass({
  displayName: 'ReactDOMTextarea',

  mixins: [AutoFocusMixin, LinkedValueUtils.Mixin, ReactBrowserComponentMixin],

  getInitialState: function() {
    var defaultValue = this.props.defaultValue;
    // TODO (yungsters): Remove support for children content in <textarea>.
    var children = this.props.children;
    if (children != null) {
      if ("production" !== process.env.NODE_ENV) {
        ("production" !== process.env.NODE_ENV ? warning(
          false,
          'Use the `defaultValue` or `value` props instead of setting ' +
          'children on <textarea>.'
        ) : null);
      }
      ("production" !== process.env.NODE_ENV ? invariant(
        defaultValue == null,
        'If you supply `defaultValue` on a <textarea>, do not pass children.'
      ) : invariant(defaultValue == null));
      if (Array.isArray(children)) {
        ("production" !== process.env.NODE_ENV ? invariant(
          children.length <= 1,
          '<textarea> can only have at most one child.'
        ) : invariant(children.length <= 1));
        children = children[0];
      }

      defaultValue = '' + children;
    }
    if (defaultValue == null) {
      defaultValue = '';
    }
    var value = LinkedValueUtils.getValue(this);
    return {
      // We save the initial value so that `ReactDOMComponent` doesn't update
      // `textContent` (unnecessary since we update value).
      // The initial value can be a boolean or object so that's why it's
      // forced to be a string.
      initialValue: '' + (value != null ? value : defaultValue)
    };
  },

  render: function() {
    // Clone `this.props` so we don't mutate the input.
    var props = assign({}, this.props);

    ("production" !== process.env.NODE_ENV ? invariant(
      props.dangerouslySetInnerHTML == null,
      '`dangerouslySetInnerHTML` does not make sense on <textarea>.'
    ) : invariant(props.dangerouslySetInnerHTML == null));

    props.defaultValue = null;
    props.value = null;
    props.onChange = this._handleChange;

    // Always set children to the same thing. In IE9, the selection range will
    // get reset if `textContent` is mutated.
    return textarea(props, this.state.initialValue);
  },

  componentDidUpdate: function(prevProps, prevState, prevContext) {
    var value = LinkedValueUtils.getValue(this);
    if (value != null) {
      var rootNode = this.getDOMNode();
      // Cast `value` to a string to ensure the value is set correctly. While
      // browsers typically do this as necessary, jsdom doesn't.
      DOMPropertyOperations.setValueForProperty(rootNode, 'value', '' + value);
    }
  },

  _handleChange: function(event) {
    var returnValue;
    var onChange = LinkedValueUtils.getOnChange(this);
    if (onChange) {
      returnValue = onChange.call(this, event);
    }
    ReactUpdates.asap(forceUpdateIfMounted, this);
    return returnValue;
  }

});

module.exports = ReactDOMTextarea;

}).call(this,require('_process'))
},{"./AutoFocusMixin":34,"./DOMPropertyOperations":44,"./LinkedValueUtils":56,"./Object.assign":59,"./ReactBrowserComponentMixin":62,"./ReactCompositeComponent":67,"./ReactDOM":70,"./ReactElement":85,"./ReactUpdates":112,"./invariant":160,"./warning":179,"_process":28}],81:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDefaultBatchingStrategy
 */

"use strict";

var ReactUpdates = require("./ReactUpdates");
var Transaction = require("./Transaction");

var assign = require("./Object.assign");
var emptyFunction = require("./emptyFunction");

var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function() {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;
  }
};

var FLUSH_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)
};

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];

function ReactDefaultBatchingStrategyTransaction() {
  this.reinitializeTransaction();
}

assign(
  ReactDefaultBatchingStrategyTransaction.prototype,
  Transaction.Mixin,
  {
    getTransactionWrappers: function() {
      return TRANSACTION_WRAPPERS;
    }
  }
);

var transaction = new ReactDefaultBatchingStrategyTransaction();

var ReactDefaultBatchingStrategy = {
  isBatchingUpdates: false,

  /**
   * Call the provided function in a context within which calls to `setState`
   * and friends are batched such that components aren't updated unnecessarily.
   */
  batchedUpdates: function(callback, a, b) {
    var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;

    ReactDefaultBatchingStrategy.isBatchingUpdates = true;

    // The code is written this way to avoid extra allocations
    if (alreadyBatchingUpdates) {
      callback(a, b);
    } else {
      transaction.perform(callback, null, a, b);
    }
  }
};

module.exports = ReactDefaultBatchingStrategy;

},{"./Object.assign":59,"./ReactUpdates":112,"./Transaction":128,"./emptyFunction":141}],82:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDefaultInjection
 */

"use strict";

var BeforeInputEventPlugin = require("./BeforeInputEventPlugin");
var ChangeEventPlugin = require("./ChangeEventPlugin");
var ClientReactRootIndex = require("./ClientReactRootIndex");
var CompositionEventPlugin = require("./CompositionEventPlugin");
var DefaultEventPluginOrder = require("./DefaultEventPluginOrder");
var EnterLeaveEventPlugin = require("./EnterLeaveEventPlugin");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var HTMLDOMPropertyConfig = require("./HTMLDOMPropertyConfig");
var MobileSafariClickEventPlugin = require("./MobileSafariClickEventPlugin");
var ReactBrowserComponentMixin = require("./ReactBrowserComponentMixin");
var ReactComponentBrowserEnvironment =
  require("./ReactComponentBrowserEnvironment");
var ReactDefaultBatchingStrategy = require("./ReactDefaultBatchingStrategy");
var ReactDOMComponent = require("./ReactDOMComponent");
var ReactDOMButton = require("./ReactDOMButton");
var ReactDOMForm = require("./ReactDOMForm");
var ReactDOMImg = require("./ReactDOMImg");
var ReactDOMInput = require("./ReactDOMInput");
var ReactDOMOption = require("./ReactDOMOption");
var ReactDOMSelect = require("./ReactDOMSelect");
var ReactDOMTextarea = require("./ReactDOMTextarea");
var ReactEventListener = require("./ReactEventListener");
var ReactInjection = require("./ReactInjection");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactMount = require("./ReactMount");
var SelectEventPlugin = require("./SelectEventPlugin");
var ServerReactRootIndex = require("./ServerReactRootIndex");
var SimpleEventPlugin = require("./SimpleEventPlugin");
var SVGDOMPropertyConfig = require("./SVGDOMPropertyConfig");

var createFullPageComponent = require("./createFullPageComponent");

function inject() {
  ReactInjection.EventEmitter.injectReactEventListener(
    ReactEventListener
  );

  /**
   * Inject modules for resolving DOM hierarchy and plugin ordering.
   */
  ReactInjection.EventPluginHub.injectEventPluginOrder(DefaultEventPluginOrder);
  ReactInjection.EventPluginHub.injectInstanceHandle(ReactInstanceHandles);
  ReactInjection.EventPluginHub.injectMount(ReactMount);

  /**
   * Some important event plugins included by default (without having to require
   * them).
   */
  ReactInjection.EventPluginHub.injectEventPluginsByName({
    SimpleEventPlugin: SimpleEventPlugin,
    EnterLeaveEventPlugin: EnterLeaveEventPlugin,
    ChangeEventPlugin: ChangeEventPlugin,
    CompositionEventPlugin: CompositionEventPlugin,
    MobileSafariClickEventPlugin: MobileSafariClickEventPlugin,
    SelectEventPlugin: SelectEventPlugin,
    BeforeInputEventPlugin: BeforeInputEventPlugin
  });

  ReactInjection.NativeComponent.injectGenericComponentClass(
    ReactDOMComponent
  );

  ReactInjection.NativeComponent.injectComponentClasses({
    'button': ReactDOMButton,
    'form': ReactDOMForm,
    'img': ReactDOMImg,
    'input': ReactDOMInput,
    'option': ReactDOMOption,
    'select': ReactDOMSelect,
    'textarea': ReactDOMTextarea,

    'html': createFullPageComponent('html'),
    'head': createFullPageComponent('head'),
    'body': createFullPageComponent('body')
  });

  // This needs to happen after createFullPageComponent() otherwise the mixin
  // gets double injected.
  ReactInjection.CompositeComponent.injectMixin(ReactBrowserComponentMixin);

  ReactInjection.DOMProperty.injectDOMPropertyConfig(HTMLDOMPropertyConfig);
  ReactInjection.DOMProperty.injectDOMPropertyConfig(SVGDOMPropertyConfig);

  ReactInjection.EmptyComponent.injectEmptyComponent('noscript');

  ReactInjection.Updates.injectReconcileTransaction(
    ReactComponentBrowserEnvironment.ReactReconcileTransaction
  );
  ReactInjection.Updates.injectBatchingStrategy(
    ReactDefaultBatchingStrategy
  );

  ReactInjection.RootIndex.injectCreateReactRootIndex(
    ExecutionEnvironment.canUseDOM ?
      ClientReactRootIndex.createReactRootIndex :
      ServerReactRootIndex.createReactRootIndex
  );

  ReactInjection.Component.injectEnvironment(ReactComponentBrowserEnvironment);

  if ("production" !== process.env.NODE_ENV) {
    var url = (ExecutionEnvironment.canUseDOM && window.location.href) || '';
    if ((/[?&]react_perf\b/).test(url)) {
      var ReactDefaultPerf = require("./ReactDefaultPerf");
      ReactDefaultPerf.start();
    }
  }
}

module.exports = {
  inject: inject
};

}).call(this,require('_process'))
},{"./BeforeInputEventPlugin":35,"./ChangeEventPlugin":39,"./ClientReactRootIndex":40,"./CompositionEventPlugin":41,"./DefaultEventPluginOrder":46,"./EnterLeaveEventPlugin":47,"./ExecutionEnvironment":54,"./HTMLDOMPropertyConfig":55,"./MobileSafariClickEventPlugin":58,"./ReactBrowserComponentMixin":62,"./ReactComponentBrowserEnvironment":66,"./ReactDOMButton":71,"./ReactDOMComponent":72,"./ReactDOMForm":73,"./ReactDOMImg":75,"./ReactDOMInput":76,"./ReactDOMOption":77,"./ReactDOMSelect":78,"./ReactDOMTextarea":80,"./ReactDefaultBatchingStrategy":81,"./ReactDefaultPerf":83,"./ReactEventListener":90,"./ReactInjection":91,"./ReactInstanceHandles":93,"./ReactMount":96,"./SVGDOMPropertyConfig":113,"./SelectEventPlugin":114,"./ServerReactRootIndex":115,"./SimpleEventPlugin":116,"./createFullPageComponent":137,"_process":28}],83:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDefaultPerf
 * @typechecks static-only
 */

"use strict";

var DOMProperty = require("./DOMProperty");
var ReactDefaultPerfAnalysis = require("./ReactDefaultPerfAnalysis");
var ReactMount = require("./ReactMount");
var ReactPerf = require("./ReactPerf");

var performanceNow = require("./performanceNow");

function roundFloat(val) {
  return Math.floor(val * 100) / 100;
}

function addValue(obj, key, val) {
  obj[key] = (obj[key] || 0) + val;
}

var ReactDefaultPerf = {
  _allMeasurements: [], // last item in the list is the current one
  _mountStack: [0],
  _injected: false,

  start: function() {
    if (!ReactDefaultPerf._injected) {
      ReactPerf.injection.injectMeasure(ReactDefaultPerf.measure);
    }

    ReactDefaultPerf._allMeasurements.length = 0;
    ReactPerf.enableMeasure = true;
  },

  stop: function() {
    ReactPerf.enableMeasure = false;
  },

  getLastMeasurements: function() {
    return ReactDefaultPerf._allMeasurements;
  },

  printExclusive: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getExclusiveSummary(measurements);
    console.table(summary.map(function(item) {
      return {
        'Component class name': item.componentName,
        'Total inclusive time (ms)': roundFloat(item.inclusive),
        'Exclusive mount time (ms)': roundFloat(item.exclusive),
        'Exclusive render time (ms)': roundFloat(item.render),
        'Mount time per instance (ms)': roundFloat(item.exclusive / item.count),
        'Render time per instance (ms)': roundFloat(item.render / item.count),
        'Instances': item.count
      };
    }));
    // TODO: ReactDefaultPerfAnalysis.getTotalTime() does not return the correct
    // number.
  },

  printInclusive: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getInclusiveSummary(measurements);
    console.table(summary.map(function(item) {
      return {
        'Owner > component': item.componentName,
        'Inclusive time (ms)': roundFloat(item.time),
        'Instances': item.count
      };
    }));
    console.log(
      'Total time:',
      ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms'
    );
  },

  getMeasurementsSummaryMap: function(measurements) {
    var summary = ReactDefaultPerfAnalysis.getInclusiveSummary(
      measurements,
      true
    );
    return summary.map(function(item) {
      return {
        'Owner > component': item.componentName,
        'Wasted time (ms)': item.time,
        'Instances': item.count
      };
    });
  },

  printWasted: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    console.table(ReactDefaultPerf.getMeasurementsSummaryMap(measurements));
    console.log(
      'Total time:',
      ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms'
    );
  },

  printDOM: function(measurements) {
    measurements = measurements || ReactDefaultPerf._allMeasurements;
    var summary = ReactDefaultPerfAnalysis.getDOMSummary(measurements);
    console.table(summary.map(function(item) {
      var result = {};
      result[DOMProperty.ID_ATTRIBUTE_NAME] = item.id;
      result['type'] = item.type;
      result['args'] = JSON.stringify(item.args);
      return result;
    }));
    console.log(
      'Total time:',
      ReactDefaultPerfAnalysis.getTotalTime(measurements).toFixed(2) + ' ms'
    );
  },

  _recordWrite: function(id, fnName, totalTime, args) {
    // TODO: totalTime isn't that useful since it doesn't count paints/reflows
    var writes =
      ReactDefaultPerf
        ._allMeasurements[ReactDefaultPerf._allMeasurements.length - 1]
        .writes;
    writes[id] = writes[id] || [];
    writes[id].push({
      type: fnName,
      time: totalTime,
      args: args
    });
  },

  measure: function(moduleName, fnName, func) {
    return function() {for (var args=[],$__0=0,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
      var totalTime;
      var rv;
      var start;

      if (fnName === '_renderNewRootComponent' ||
          fnName === 'flushBatchedUpdates') {
        // A "measurement" is a set of metrics recorded for each flush. We want
        // to group the metrics for a given flush together so we can look at the
        // components that rendered and the DOM operations that actually
        // happened to determine the amount of "wasted work" performed.
        ReactDefaultPerf._allMeasurements.push({
          exclusive: {},
          inclusive: {},
          render: {},
          counts: {},
          writes: {},
          displayNames: {},
          totalTime: 0
        });
        start = performanceNow();
        rv = func.apply(this, args);
        ReactDefaultPerf._allMeasurements[
          ReactDefaultPerf._allMeasurements.length - 1
        ].totalTime = performanceNow() - start;
        return rv;
      } else if (moduleName === 'ReactDOMIDOperations' ||
        moduleName === 'ReactComponentBrowserEnvironment') {
        start = performanceNow();
        rv = func.apply(this, args);
        totalTime = performanceNow() - start;

        if (fnName === 'mountImageIntoNode') {
          var mountID = ReactMount.getID(args[1]);
          ReactDefaultPerf._recordWrite(mountID, fnName, totalTime, args[0]);
        } else if (fnName === 'dangerouslyProcessChildrenUpdates') {
          // special format
          args[0].forEach(function(update) {
            var writeArgs = {};
            if (update.fromIndex !== null) {
              writeArgs.fromIndex = update.fromIndex;
            }
            if (update.toIndex !== null) {
              writeArgs.toIndex = update.toIndex;
            }
            if (update.textContent !== null) {
              writeArgs.textContent = update.textContent;
            }
            if (update.markupIndex !== null) {
              writeArgs.markup = args[1][update.markupIndex];
            }
            ReactDefaultPerf._recordWrite(
              update.parentID,
              update.type,
              totalTime,
              writeArgs
            );
          });
        } else {
          // basic format
          ReactDefaultPerf._recordWrite(
            args[0],
            fnName,
            totalTime,
            Array.prototype.slice.call(args, 1)
          );
        }
        return rv;
      } else if (moduleName === 'ReactCompositeComponent' && (
        fnName === 'mountComponent' ||
        fnName === 'updateComponent' || // TODO: receiveComponent()?
        fnName === '_renderValidatedComponent')) {

        var rootNodeID = fnName === 'mountComponent' ?
          args[0] :
          this._rootNodeID;
        var isRender = fnName === '_renderValidatedComponent';
        var isMount = fnName === 'mountComponent';

        var mountStack = ReactDefaultPerf._mountStack;
        var entry = ReactDefaultPerf._allMeasurements[
          ReactDefaultPerf._allMeasurements.length - 1
        ];

        if (isRender) {
          addValue(entry.counts, rootNodeID, 1);
        } else if (isMount) {
          mountStack.push(0);
        }

        start = performanceNow();
        rv = func.apply(this, args);
        totalTime = performanceNow() - start;

        if (isRender) {
          addValue(entry.render, rootNodeID, totalTime);
        } else if (isMount) {
          var subMountTime = mountStack.pop();
          mountStack[mountStack.length - 1] += totalTime;
          addValue(entry.exclusive, rootNodeID, totalTime - subMountTime);
          addValue(entry.inclusive, rootNodeID, totalTime);
        } else {
          addValue(entry.inclusive, rootNodeID, totalTime);
        }

        entry.displayNames[rootNodeID] = {
          current: this.constructor.displayName,
          owner: this._owner ? this._owner.constructor.displayName : '<root>'
        };

        return rv;
      } else {
        return func.apply(this, args);
      }
    };
  }
};

module.exports = ReactDefaultPerf;

},{"./DOMProperty":43,"./ReactDefaultPerfAnalysis":84,"./ReactMount":96,"./ReactPerf":101,"./performanceNow":173}],84:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDefaultPerfAnalysis
 */

var assign = require("./Object.assign");

// Don't try to save users less than 1.2ms (a number I made up)
var DONT_CARE_THRESHOLD = 1.2;
var DOM_OPERATION_TYPES = {
  'mountImageIntoNode': 'set innerHTML',
  INSERT_MARKUP: 'set innerHTML',
  MOVE_EXISTING: 'move',
  REMOVE_NODE: 'remove',
  TEXT_CONTENT: 'set textContent',
  'updatePropertyByID': 'update attribute',
  'deletePropertyByID': 'delete attribute',
  'updateStylesByID': 'update styles',
  'updateInnerHTMLByID': 'set innerHTML',
  'dangerouslyReplaceNodeWithMarkupByID': 'replace'
};

function getTotalTime(measurements) {
  // TODO: return number of DOM ops? could be misleading.
  // TODO: measure dropped frames after reconcile?
  // TODO: log total time of each reconcile and the top-level component
  // class that triggered it.
  var totalTime = 0;
  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    totalTime += measurement.totalTime;
  }
  return totalTime;
}

function getDOMSummary(measurements) {
  var items = [];
  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    var id;

    for (id in measurement.writes) {
      measurement.writes[id].forEach(function(write) {
        items.push({
          id: id,
          type: DOM_OPERATION_TYPES[write.type] || write.type,
          args: write.args
        });
      });
    }
  }
  return items;
}

function getExclusiveSummary(measurements) {
  var candidates = {};
  var displayName;

  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    var allIDs = assign(
      {},
      measurement.exclusive,
      measurement.inclusive
    );

    for (var id in allIDs) {
      displayName = measurement.displayNames[id].current;

      candidates[displayName] = candidates[displayName] || {
        componentName: displayName,
        inclusive: 0,
        exclusive: 0,
        render: 0,
        count: 0
      };
      if (measurement.render[id]) {
        candidates[displayName].render += measurement.render[id];
      }
      if (measurement.exclusive[id]) {
        candidates[displayName].exclusive += measurement.exclusive[id];
      }
      if (measurement.inclusive[id]) {
        candidates[displayName].inclusive += measurement.inclusive[id];
      }
      if (measurement.counts[id]) {
        candidates[displayName].count += measurement.counts[id];
      }
    }
  }

  // Now make a sorted array with the results.
  var arr = [];
  for (displayName in candidates) {
    if (candidates[displayName].exclusive >= DONT_CARE_THRESHOLD) {
      arr.push(candidates[displayName]);
    }
  }

  arr.sort(function(a, b) {
    return b.exclusive - a.exclusive;
  });

  return arr;
}

function getInclusiveSummary(measurements, onlyClean) {
  var candidates = {};
  var inclusiveKey;

  for (var i = 0; i < measurements.length; i++) {
    var measurement = measurements[i];
    var allIDs = assign(
      {},
      measurement.exclusive,
      measurement.inclusive
    );
    var cleanComponents;

    if (onlyClean) {
      cleanComponents = getUnchangedComponents(measurement);
    }

    for (var id in allIDs) {
      if (onlyClean && !cleanComponents[id]) {
        continue;
      }

      var displayName = measurement.displayNames[id];

      // Inclusive time is not useful for many components without knowing where
      // they are instantiated. So we aggregate inclusive time with both the
      // owner and current displayName as the key.
      inclusiveKey = displayName.owner + ' > ' + displayName.current;

      candidates[inclusiveKey] = candidates[inclusiveKey] || {
        componentName: inclusiveKey,
        time: 0,
        count: 0
      };

      if (measurement.inclusive[id]) {
        candidates[inclusiveKey].time += measurement.inclusive[id];
      }
      if (measurement.counts[id]) {
        candidates[inclusiveKey].count += measurement.counts[id];
      }
    }
  }

  // Now make a sorted array with the results.
  var arr = [];
  for (inclusiveKey in candidates) {
    if (candidates[inclusiveKey].time >= DONT_CARE_THRESHOLD) {
      arr.push(candidates[inclusiveKey]);
    }
  }

  arr.sort(function(a, b) {
    return b.time - a.time;
  });

  return arr;
}

function getUnchangedComponents(measurement) {
  // For a given reconcile, look at which components did not actually
  // render anything to the DOM and return a mapping of their ID to
  // the amount of time it took to render the entire subtree.
  var cleanComponents = {};
  var dirtyLeafIDs = Object.keys(measurement.writes);
  var allIDs = assign({}, measurement.exclusive, measurement.inclusive);

  for (var id in allIDs) {
    var isDirty = false;
    // For each component that rendered, see if a component that triggered
    // a DOM op is in its subtree.
    for (var i = 0; i < dirtyLeafIDs.length; i++) {
      if (dirtyLeafIDs[i].indexOf(id) === 0) {
        isDirty = true;
        break;
      }
    }
    if (!isDirty && measurement.counts[id] > 0) {
      cleanComponents[id] = true;
    }
  }
  return cleanComponents;
}

var ReactDefaultPerfAnalysis = {
  getExclusiveSummary: getExclusiveSummary,
  getInclusiveSummary: getInclusiveSummary,
  getDOMSummary: getDOMSummary,
  getTotalTime: getTotalTime
};

module.exports = ReactDefaultPerfAnalysis;

},{"./Object.assign":59}],85:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactElement
 */

"use strict";

var ReactContext = require("./ReactContext");
var ReactCurrentOwner = require("./ReactCurrentOwner");

var warning = require("./warning");

var RESERVED_PROPS = {
  key: true,
  ref: true
};

/**
 * Warn for mutations.
 *
 * @internal
 * @param {object} object
 * @param {string} key
 */
function defineWarningProperty(object, key) {
  Object.defineProperty(object, key, {

    configurable: false,
    enumerable: true,

    get: function() {
      if (!this._store) {
        return null;
      }
      return this._store[key];
    },

    set: function(value) {
      ("production" !== process.env.NODE_ENV ? warning(
        false,
        'Don\'t set the ' + key + ' property of the component. ' +
        'Mutate the existing props object instead.'
      ) : null);
      this._store[key] = value;
    }

  });
}

/**
 * This is updated to true if the membrane is successfully created.
 */
var useMutationMembrane = false;

/**
 * Warn for mutations.
 *
 * @internal
 * @param {object} element
 */
function defineMutationMembrane(prototype) {
  try {
    var pseudoFrozenProperties = {
      props: true
    };
    for (var key in pseudoFrozenProperties) {
      defineWarningProperty(prototype, key);
    }
    useMutationMembrane = true;
  } catch (x) {
    // IE will fail on defineProperty
  }
}

/**
 * Base constructor for all React elements. This is only used to make this
 * work with a dynamic instanceof check. Nothing should live on this prototype.
 *
 * @param {*} type
 * @param {string|object} ref
 * @param {*} key
 * @param {*} props
 * @internal
 */
var ReactElement = function(type, key, ref, owner, context, props) {
  // Built-in properties that belong on the element
  this.type = type;
  this.key = key;
  this.ref = ref;

  // Record the component responsible for creating this element.
  this._owner = owner;

  // TODO: Deprecate withContext, and then the context becomes accessible
  // through the owner.
  this._context = context;

  if ("production" !== process.env.NODE_ENV) {
    // The validation flag and props are currently mutative. We put them on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    this._store = { validated: false, props: props };

    // We're not allowed to set props directly on the object so we early
    // return and rely on the prototype membrane to forward to the backing
    // store.
    if (useMutationMembrane) {
      Object.freeze(this);
      return;
    }
  }

  this.props = props;
};

// We intentionally don't expose the function on the constructor property.
// ReactElement should be indistinguishable from a plain object.
ReactElement.prototype = {
  _isReactElement: true
};

if ("production" !== process.env.NODE_ENV) {
  defineMutationMembrane(ReactElement.prototype);
}

ReactElement.createElement = function(type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;

  if (config != null) {
    ref = config.ref === undefined ? null : config.ref;
    if ("production" !== process.env.NODE_ENV) {
      ("production" !== process.env.NODE_ENV ? warning(
        config.key !== null,
        'createElement(...): Encountered component with a `key` of null. In ' +
        'a future version, this will be treated as equivalent to the string ' +
        '\'null\'; instead, provide an explicit key or use undefined.'
      ) : null);
    }
    // TODO: Change this back to `config.key === undefined`
    key = config.key == null ? null : '' + config.key;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (config.hasOwnProperty(propName) &&
          !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (typeof props[propName] === 'undefined') {
        props[propName] = defaultProps[propName];
      }
    }
  }

  return new ReactElement(
    type,
    key,
    ref,
    ReactCurrentOwner.current,
    ReactContext.current,
    props
  );
};

ReactElement.createFactory = function(type) {
  var factory = ReactElement.createElement.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. <Foo />.type === Foo.type.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  factory.type = type;
  return factory;
};

ReactElement.cloneAndReplaceProps = function(oldElement, newProps) {
  var newElement = new ReactElement(
    oldElement.type,
    oldElement.key,
    oldElement.ref,
    oldElement._owner,
    oldElement._context,
    newProps
  );

  if ("production" !== process.env.NODE_ENV) {
    // If the key on the original is valid, then the clone is valid
    newElement._store.validated = oldElement._store.validated;
  }
  return newElement;
};

/**
 * @param {?object} object
 * @return {boolean} True if `object` is a valid component.
 * @final
 */
ReactElement.isValidElement = function(object) {
  // ReactTestUtils is often used outside of beforeEach where as React is
  // within it. This leads to two different instances of React on the same
  // page. To identify a element from a different React instance we use
  // a flag instead of an instanceof check.
  var isElement = !!(object && object._isReactElement);
  // if (isElement && !(object instanceof ReactElement)) {
  // This is an indicator that you're using multiple versions of React at the
  // same time. This will screw with ownership and stuff. Fix it, please.
  // TODO: We could possibly warn here.
  // }
  return isElement;
};

module.exports = ReactElement;

}).call(this,require('_process'))
},{"./ReactContext":68,"./ReactCurrentOwner":69,"./warning":179,"_process":28}],86:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactElementValidator
 */

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

"use strict";

var ReactElement = require("./ReactElement");
var ReactPropTypeLocations = require("./ReactPropTypeLocations");
var ReactCurrentOwner = require("./ReactCurrentOwner");

var monitorCodeUse = require("./monitorCodeUse");
var warning = require("./warning");

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {
  'react_key_warning': {},
  'react_numeric_key_warning': {}
};
var ownerHasMonitoredObjectMap = {};

var loggedTypeFailures = {};

var NUMERIC_PROPERTY_REGEX = /^\d+$/;

/**
 * Gets the current owner's displayName for use in warnings.
 *
 * @internal
 * @return {?string} Display name or undefined
 */
function getCurrentOwnerDisplayName() {
  var current = ReactCurrentOwner.current;
  return current && current.constructor.displayName || undefined;
}

/**
 * Warn if the component doesn't have an explicit key assigned to it.
 * This component is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it.
 *
 * @internal
 * @param {ReactComponent} component Component that requires a key.
 * @param {*} parentType component's parent's type.
 */
function validateExplicitKey(component, parentType) {
  if (component._store.validated || component.key != null) {
    return;
  }
  component._store.validated = true;

  warnAndMonitorForKeyUse(
    'react_key_warning',
    'Each child in an array should have a unique "key" prop.',
    component,
    parentType
  );
}

/**
 * Warn if the key is being defined as an object property but has an incorrect
 * value.
 *
 * @internal
 * @param {string} name Property name of the key.
 * @param {ReactComponent} component Component that requires a key.
 * @param {*} parentType component's parent's type.
 */
function validatePropertyKey(name, component, parentType) {
  if (!NUMERIC_PROPERTY_REGEX.test(name)) {
    return;
  }
  warnAndMonitorForKeyUse(
    'react_numeric_key_warning',
    'Child objects should have non-numeric keys so ordering is preserved.',
    component,
    parentType
  );
}

/**
 * Shared warning and monitoring code for the key warnings.
 *
 * @internal
 * @param {string} warningID The id used when logging.
 * @param {string} message The base warning that gets output.
 * @param {ReactComponent} component Component that requires a key.
 * @param {*} parentType component's parent's type.
 */
function warnAndMonitorForKeyUse(warningID, message, component, parentType) {
  var ownerName = getCurrentOwnerDisplayName();
  var parentName = parentType.displayName;

  var useName = ownerName || parentName;
  var memoizer = ownerHasKeyUseWarning[warningID];
  if (memoizer.hasOwnProperty(useName)) {
    return;
  }
  memoizer[useName] = true;

  message += ownerName ?
    (" Check the render method of " + ownerName + ".") :
    (" Check the renderComponent call using <" + parentName + ">.");

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwnerName = null;
  if (component._owner && component._owner !== ReactCurrentOwner.current) {
    // Name of the component that originally created this child.
    childOwnerName = component._owner.constructor.displayName;

    message += (" It was passed a child from " + childOwnerName + ".");
  }

  message += ' See http://fb.me/react-warning-keys for more information.';
  monitorCodeUse(warningID, {
    component: useName,
    componentOwner: childOwnerName
  });
  console.warn(message);
}

/**
 * Log that we're using an object map. We're considering deprecating this
 * feature and replace it with proper Map and ImmutableMap data structures.
 *
 * @internal
 */
function monitorUseOfObjectMap() {
  var currentName = getCurrentOwnerDisplayName() || '';
  if (ownerHasMonitoredObjectMap.hasOwnProperty(currentName)) {
    return;
  }
  ownerHasMonitoredObjectMap[currentName] = true;
  monitorCodeUse('react_object_map_children');
}

/**
 * Ensure that every component either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {*} component Statically passed child of any type.
 * @param {*} parentType component's parent's type.
 * @return {boolean}
 */
function validateChildKeys(component, parentType) {
  if (Array.isArray(component)) {
    for (var i = 0; i < component.length; i++) {
      var child = component[i];
      if (ReactElement.isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (ReactElement.isValidElement(component)) {
    // This component was passed in a valid location.
    component._store.validated = true;
  } else if (component && typeof component === 'object') {
    monitorUseOfObjectMap();
    for (var name in component) {
      validatePropertyKey(name, component[name], parentType);
    }
  }
}

/**
 * Assert that the props are valid
 *
 * @param {string} componentName Name of the component for error messages.
 * @param {object} propTypes Map of prop name to a ReactPropType
 * @param {object} props
 * @param {string} location e.g. "prop", "context", "child context"
 * @private
 */
function checkPropTypes(componentName, propTypes, props, location) {
  for (var propName in propTypes) {
    if (propTypes.hasOwnProperty(propName)) {
      var error;
      // Prop type validation may throw. In case they do, we don't want to
      // fail the render phase where it didn't fail before. So we log it.
      // After these have been cleaned up, we'll let them throw.
      try {
        error = propTypes[propName](props, propName, componentName, location);
      } catch (ex) {
        error = ex;
      }
      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
        // Only monitor this failure once because there tends to be a lot of the
        // same error.
        loggedTypeFailures[error.message] = true;
        // This will soon use the warning module
        monitorCodeUse(
          'react_failed_descriptor_type_check',
          { message: error.message }
        );
      }
    }
  }
}

var ReactElementValidator = {

  createElement: function(type, props, children) {
    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    ("production" !== process.env.NODE_ENV ? warning(
      type != null,
      'React.createElement: type should not be null or undefined. It should ' +
        'be a string (for DOM elements) or a ReactClass (for composite ' +
        'components).'
    ) : null);

    var element = ReactElement.createElement.apply(this, arguments);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }

    if (type) {
      var name = type.displayName;
      if (type.propTypes) {
        checkPropTypes(
          name,
          type.propTypes,
          element.props,
          ReactPropTypeLocations.prop
        );
      }
      if (type.contextTypes) {
        checkPropTypes(
          name,
          type.contextTypes,
          element._context,
          ReactPropTypeLocations.context
        );
      }
    }
    return element;
  },

  createFactory: function(type) {
    var validatedFactory = ReactElementValidator.createElement.bind(
      null,
      type
    );
    validatedFactory.type = type;
    return validatedFactory;
  }

};

module.exports = ReactElementValidator;

}).call(this,require('_process'))
},{"./ReactCurrentOwner":69,"./ReactElement":85,"./ReactPropTypeLocations":104,"./monitorCodeUse":170,"./warning":179,"_process":28}],87:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactEmptyComponent
 */

"use strict";

var ReactElement = require("./ReactElement");

var invariant = require("./invariant");

var component;
// This registry keeps track of the React IDs of the components that rendered to
// `null` (in reality a placeholder such as `noscript`)
var nullComponentIdsRegistry = {};

var ReactEmptyComponentInjection = {
  injectEmptyComponent: function(emptyComponent) {
    component = ReactElement.createFactory(emptyComponent);
  }
};

/**
 * @return {ReactComponent} component The injected empty component.
 */
function getEmptyComponent() {
  ("production" !== process.env.NODE_ENV ? invariant(
    component,
    'Trying to return null from a render, but no null placeholder component ' +
    'was injected.'
  ) : invariant(component));
  return component();
}

/**
 * Mark the component as having rendered to null.
 * @param {string} id Component's `_rootNodeID`.
 */
function registerNullComponentID(id) {
  nullComponentIdsRegistry[id] = true;
}

/**
 * Unmark the component as having rendered to null: it renders to something now.
 * @param {string} id Component's `_rootNodeID`.
 */
function deregisterNullComponentID(id) {
  delete nullComponentIdsRegistry[id];
}

/**
 * @param {string} id Component's `_rootNodeID`.
 * @return {boolean} True if the component is rendered to null.
 */
function isNullComponentID(id) {
  return nullComponentIdsRegistry[id];
}

var ReactEmptyComponent = {
  deregisterNullComponentID: deregisterNullComponentID,
  getEmptyComponent: getEmptyComponent,
  injection: ReactEmptyComponentInjection,
  isNullComponentID: isNullComponentID,
  registerNullComponentID: registerNullComponentID
};

module.exports = ReactEmptyComponent;

}).call(this,require('_process'))
},{"./ReactElement":85,"./invariant":160,"_process":28}],88:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactErrorUtils
 * @typechecks
 */

"use strict";

var ReactErrorUtils = {
  /**
   * Creates a guarded version of a function. This is supposed to make debugging
   * of event handlers easier. To aid debugging with the browser's debugger,
   * this currently simply returns the original function.
   *
   * @param {function} func Function to be executed
   * @param {string} name The name of the guard
   * @return {function}
   */
  guard: function(func, name) {
    return func;
  }
};

module.exports = ReactErrorUtils;

},{}],89:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactEventEmitterMixin
 */

"use strict";

var EventPluginHub = require("./EventPluginHub");

function runEventQueueInBatch(events) {
  EventPluginHub.enqueueEvents(events);
  EventPluginHub.processEventQueue();
}

var ReactEventEmitterMixin = {

  /**
   * Streams a fired top-level event to `EventPluginHub` where plugins have the
   * opportunity to create `ReactEvent`s to be dispatched.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {object} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native environment event.
   */
  handleTopLevel: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    var events = EventPluginHub.extractEvents(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent
    );

    runEventQueueInBatch(events);
  }
};

module.exports = ReactEventEmitterMixin;

},{"./EventPluginHub":50}],90:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactEventListener
 * @typechecks static-only
 */

"use strict";

var EventListener = require("./EventListener");
var ExecutionEnvironment = require("./ExecutionEnvironment");
var PooledClass = require("./PooledClass");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactMount = require("./ReactMount");
var ReactUpdates = require("./ReactUpdates");

var assign = require("./Object.assign");
var getEventTarget = require("./getEventTarget");
var getUnboundedScrollPosition = require("./getUnboundedScrollPosition");

/**
 * Finds the parent React component of `node`.
 *
 * @param {*} node
 * @return {?DOMEventTarget} Parent container, or `null` if the specified node
 *                           is not nested.
 */
function findParent(node) {
  // TODO: It may be a good idea to cache this to prevent unnecessary DOM
  // traversal, but caching is difficult to do correctly without using a
  // mutation observer to listen for all DOM changes.
  var nodeID = ReactMount.getID(node);
  var rootID = ReactInstanceHandles.getReactRootIDFromNodeID(nodeID);
  var container = ReactMount.findReactContainerForID(rootID);
  var parent = ReactMount.getFirstReactDOM(container);
  return parent;
}

// Used to store ancestor hierarchy in top level callback
function TopLevelCallbackBookKeeping(topLevelType, nativeEvent) {
  this.topLevelType = topLevelType;
  this.nativeEvent = nativeEvent;
  this.ancestors = [];
}
assign(TopLevelCallbackBookKeeping.prototype, {
  destructor: function() {
    this.topLevelType = null;
    this.nativeEvent = null;
    this.ancestors.length = 0;
  }
});
PooledClass.addPoolingTo(
  TopLevelCallbackBookKeeping,
  PooledClass.twoArgumentPooler
);

function handleTopLevelImpl(bookKeeping) {
  var topLevelTarget = ReactMount.getFirstReactDOM(
    getEventTarget(bookKeeping.nativeEvent)
  ) || window;

  // Loop through the hierarchy, in case there's any nested components.
  // It's important that we build the array of ancestors before calling any
  // event handlers, because event handlers can modify the DOM, leading to
  // inconsistencies with ReactMount's node cache. See #1105.
  var ancestor = topLevelTarget;
  while (ancestor) {
    bookKeeping.ancestors.push(ancestor);
    ancestor = findParent(ancestor);
  }

  for (var i = 0, l = bookKeeping.ancestors.length; i < l; i++) {
    topLevelTarget = bookKeeping.ancestors[i];
    var topLevelTargetID = ReactMount.getID(topLevelTarget) || '';
    ReactEventListener._handleTopLevel(
      bookKeeping.topLevelType,
      topLevelTarget,
      topLevelTargetID,
      bookKeeping.nativeEvent
    );
  }
}

function scrollValueMonitor(cb) {
  var scrollPosition = getUnboundedScrollPosition(window);
  cb(scrollPosition);
}

var ReactEventListener = {
  _enabled: true,
  _handleTopLevel: null,

  WINDOW_HANDLE: ExecutionEnvironment.canUseDOM ? window : null,

  setHandleTopLevel: function(handleTopLevel) {
    ReactEventListener._handleTopLevel = handleTopLevel;
  },

  setEnabled: function(enabled) {
    ReactEventListener._enabled = !!enabled;
  },

  isEnabled: function() {
    return ReactEventListener._enabled;
  },


  /**
   * Traps top-level events by using event bubbling.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {string} handlerBaseName Event name (e.g. "click").
   * @param {object} handle Element on which to attach listener.
   * @return {object} An object with a remove function which will forcefully
   *                  remove the listener.
   * @internal
   */
  trapBubbledEvent: function(topLevelType, handlerBaseName, handle) {
    var element = handle;
    if (!element) {
      return;
    }
    return EventListener.listen(
      element,
      handlerBaseName,
      ReactEventListener.dispatchEvent.bind(null, topLevelType)
    );
  },

  /**
   * Traps a top-level event by using event capturing.
   *
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {string} handlerBaseName Event name (e.g. "click").
   * @param {object} handle Element on which to attach listener.
   * @return {object} An object with a remove function which will forcefully
   *                  remove the listener.
   * @internal
   */
  trapCapturedEvent: function(topLevelType, handlerBaseName, handle) {
    var element = handle;
    if (!element) {
      return;
    }
    return EventListener.capture(
      element,
      handlerBaseName,
      ReactEventListener.dispatchEvent.bind(null, topLevelType)
    );
  },

  monitorScrollValue: function(refresh) {
    var callback = scrollValueMonitor.bind(null, refresh);
    EventListener.listen(window, 'scroll', callback);
    EventListener.listen(window, 'resize', callback);
  },

  dispatchEvent: function(topLevelType, nativeEvent) {
    if (!ReactEventListener._enabled) {
      return;
    }

    var bookKeeping = TopLevelCallbackBookKeeping.getPooled(
      topLevelType,
      nativeEvent
    );
    try {
      // Event queue being processed in the same cycle allows
      // `preventDefault`.
      ReactUpdates.batchedUpdates(handleTopLevelImpl, bookKeeping);
    } finally {
      TopLevelCallbackBookKeeping.release(bookKeeping);
    }
  }
};

module.exports = ReactEventListener;

},{"./EventListener":49,"./ExecutionEnvironment":54,"./Object.assign":59,"./PooledClass":60,"./ReactInstanceHandles":93,"./ReactMount":96,"./ReactUpdates":112,"./getEventTarget":151,"./getUnboundedScrollPosition":156}],91:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactInjection
 */

"use strict";

var DOMProperty = require("./DOMProperty");
var EventPluginHub = require("./EventPluginHub");
var ReactComponent = require("./ReactComponent");
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactEmptyComponent = require("./ReactEmptyComponent");
var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
var ReactNativeComponent = require("./ReactNativeComponent");
var ReactPerf = require("./ReactPerf");
var ReactRootIndex = require("./ReactRootIndex");
var ReactUpdates = require("./ReactUpdates");

var ReactInjection = {
  Component: ReactComponent.injection,
  CompositeComponent: ReactCompositeComponent.injection,
  DOMProperty: DOMProperty.injection,
  EmptyComponent: ReactEmptyComponent.injection,
  EventPluginHub: EventPluginHub.injection,
  EventEmitter: ReactBrowserEventEmitter.injection,
  NativeComponent: ReactNativeComponent.injection,
  Perf: ReactPerf.injection,
  RootIndex: ReactRootIndex.injection,
  Updates: ReactUpdates.injection
};

module.exports = ReactInjection;

},{"./DOMProperty":43,"./EventPluginHub":50,"./ReactBrowserEventEmitter":63,"./ReactComponent":65,"./ReactCompositeComponent":67,"./ReactEmptyComponent":87,"./ReactNativeComponent":99,"./ReactPerf":101,"./ReactRootIndex":108,"./ReactUpdates":112}],92:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactInputSelection
 */

"use strict";

var ReactDOMSelection = require("./ReactDOMSelection");

var containsNode = require("./containsNode");
var focusNode = require("./focusNode");
var getActiveElement = require("./getActiveElement");

function isInDocument(node) {
  return containsNode(document.documentElement, node);
}

/**
 * @ReactInputSelection: React input selection module. Based on Selection.js,
 * but modified to be suitable for react and has a couple of bug fixes (doesn't
 * assume buttons have range selections allowed).
 * Input selection module for React.
 */
var ReactInputSelection = {

  hasSelectionCapabilities: function(elem) {
    return elem && (
      (elem.nodeName === 'INPUT' && elem.type === 'text') ||
      elem.nodeName === 'TEXTAREA' ||
      elem.contentEditable === 'true'
    );
  },

  getSelectionInformation: function() {
    var focusedElem = getActiveElement();
    return {
      focusedElem: focusedElem,
      selectionRange:
          ReactInputSelection.hasSelectionCapabilities(focusedElem) ?
          ReactInputSelection.getSelection(focusedElem) :
          null
    };
  },

  /**
   * @restoreSelection: If any selection information was potentially lost,
   * restore it. This is useful when performing operations that could remove dom
   * nodes and place them back in, resulting in focus being lost.
   */
  restoreSelection: function(priorSelectionInformation) {
    var curFocusedElem = getActiveElement();
    var priorFocusedElem = priorSelectionInformation.focusedElem;
    var priorSelectionRange = priorSelectionInformation.selectionRange;
    if (curFocusedElem !== priorFocusedElem &&
        isInDocument(priorFocusedElem)) {
      if (ReactInputSelection.hasSelectionCapabilities(priorFocusedElem)) {
        ReactInputSelection.setSelection(
          priorFocusedElem,
          priorSelectionRange
        );
      }
      focusNode(priorFocusedElem);
    }
  },

  /**
   * @getSelection: Gets the selection bounds of a focused textarea, input or
   * contentEditable node.
   * -@input: Look up selection bounds of this input
   * -@return {start: selectionStart, end: selectionEnd}
   */
  getSelection: function(input) {
    var selection;

    if ('selectionStart' in input) {
      // Modern browser with input or textarea.
      selection = {
        start: input.selectionStart,
        end: input.selectionEnd
      };
    } else if (document.selection && input.nodeName === 'INPUT') {
      // IE8 input.
      var range = document.selection.createRange();
      // There can only be one selection per document in IE, so it must
      // be in our element.
      if (range.parentElement() === input) {
        selection = {
          start: -range.moveStart('character', -input.value.length),
          end: -range.moveEnd('character', -input.value.length)
        };
      }
    } else {
      // Content editable or old IE textarea.
      selection = ReactDOMSelection.getOffsets(input);
    }

    return selection || {start: 0, end: 0};
  },

  /**
   * @setSelection: Sets the selection bounds of a textarea or input and focuses
   * the input.
   * -@input     Set selection bounds of this input or textarea
   * -@offsets   Object of same form that is returned from get*
   */
  setSelection: function(input, offsets) {
    var start = offsets.start;
    var end = offsets.end;
    if (typeof end === 'undefined') {
      end = start;
    }

    if ('selectionStart' in input) {
      input.selectionStart = start;
      input.selectionEnd = Math.min(end, input.value.length);
    } else if (document.selection && input.nodeName === 'INPUT') {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveStart('character', start);
      range.moveEnd('character', end - start);
      range.select();
    } else {
      ReactDOMSelection.setOffsets(input, offsets);
    }
  }
};

module.exports = ReactInputSelection;

},{"./ReactDOMSelection":79,"./containsNode":134,"./focusNode":145,"./getActiveElement":147}],93:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactInstanceHandles
 * @typechecks static-only
 */

"use strict";

var ReactRootIndex = require("./ReactRootIndex");

var invariant = require("./invariant");

var SEPARATOR = '.';
var SEPARATOR_LENGTH = SEPARATOR.length;

/**
 * Maximum depth of traversals before we consider the possibility of a bad ID.
 */
var MAX_TREE_DEPTH = 100;

/**
 * Creates a DOM ID prefix to use when mounting React components.
 *
 * @param {number} index A unique integer
 * @return {string} React root ID.
 * @internal
 */
function getReactRootIDString(index) {
  return SEPARATOR + index.toString(36);
}

/**
 * Checks if a character in the supplied ID is a separator or the end.
 *
 * @param {string} id A React DOM ID.
 * @param {number} index Index of the character to check.
 * @return {boolean} True if the character is a separator or end of the ID.
 * @private
 */
function isBoundary(id, index) {
  return id.charAt(index) === SEPARATOR || index === id.length;
}

/**
 * Checks if the supplied string is a valid React DOM ID.
 *
 * @param {string} id A React DOM ID, maybe.
 * @return {boolean} True if the string is a valid React DOM ID.
 * @private
 */
function isValidID(id) {
  return id === '' || (
    id.charAt(0) === SEPARATOR && id.charAt(id.length - 1) !== SEPARATOR
  );
}

/**
 * Checks if the first ID is an ancestor of or equal to the second ID.
 *
 * @param {string} ancestorID
 * @param {string} descendantID
 * @return {boolean} True if `ancestorID` is an ancestor of `descendantID`.
 * @internal
 */
function isAncestorIDOf(ancestorID, descendantID) {
  return (
    descendantID.indexOf(ancestorID) === 0 &&
    isBoundary(descendantID, ancestorID.length)
  );
}

/**
 * Gets the parent ID of the supplied React DOM ID, `id`.
 *
 * @param {string} id ID of a component.
 * @return {string} ID of the parent, or an empty string.
 * @private
 */
function getParentID(id) {
  return id ? id.substr(0, id.lastIndexOf(SEPARATOR)) : '';
}

/**
 * Gets the next DOM ID on the tree path from the supplied `ancestorID` to the
 * supplied `destinationID`. If they are equal, the ID is returned.
 *
 * @param {string} ancestorID ID of an ancestor node of `destinationID`.
 * @param {string} destinationID ID of the destination node.
 * @return {string} Next ID on the path from `ancestorID` to `destinationID`.
 * @private
 */
function getNextDescendantID(ancestorID, destinationID) {
  ("production" !== process.env.NODE_ENV ? invariant(
    isValidID(ancestorID) && isValidID(destinationID),
    'getNextDescendantID(%s, %s): Received an invalid React DOM ID.',
    ancestorID,
    destinationID
  ) : invariant(isValidID(ancestorID) && isValidID(destinationID)));
  ("production" !== process.env.NODE_ENV ? invariant(
    isAncestorIDOf(ancestorID, destinationID),
    'getNextDescendantID(...): React has made an invalid assumption about ' +
    'the DOM hierarchy. Expected `%s` to be an ancestor of `%s`.',
    ancestorID,
    destinationID
  ) : invariant(isAncestorIDOf(ancestorID, destinationID)));
  if (ancestorID === destinationID) {
    return ancestorID;
  }
  // Skip over the ancestor and the immediate separator. Traverse until we hit
  // another separator or we reach the end of `destinationID`.
  var start = ancestorID.length + SEPARATOR_LENGTH;
  for (var i = start; i < destinationID.length; i++) {
    if (isBoundary(destinationID, i)) {
      break;
    }
  }
  return destinationID.substr(0, i);
}

/**
 * Gets the nearest common ancestor ID of two IDs.
 *
 * Using this ID scheme, the nearest common ancestor ID is the longest common
 * prefix of the two IDs that immediately preceded a "marker" in both strings.
 *
 * @param {string} oneID
 * @param {string} twoID
 * @return {string} Nearest common ancestor ID, or the empty string if none.
 * @private
 */
function getFirstCommonAncestorID(oneID, twoID) {
  var minLength = Math.min(oneID.length, twoID.length);
  if (minLength === 0) {
    return '';
  }
  var lastCommonMarkerIndex = 0;
  // Use `<=` to traverse until the "EOL" of the shorter string.
  for (var i = 0; i <= minLength; i++) {
    if (isBoundary(oneID, i) && isBoundary(twoID, i)) {
      lastCommonMarkerIndex = i;
    } else if (oneID.charAt(i) !== twoID.charAt(i)) {
      break;
    }
  }
  var longestCommonID = oneID.substr(0, lastCommonMarkerIndex);
  ("production" !== process.env.NODE_ENV ? invariant(
    isValidID(longestCommonID),
    'getFirstCommonAncestorID(%s, %s): Expected a valid React DOM ID: %s',
    oneID,
    twoID,
    longestCommonID
  ) : invariant(isValidID(longestCommonID)));
  return longestCommonID;
}

/**
 * Traverses the parent path between two IDs (either up or down). The IDs must
 * not be the same, and there must exist a parent path between them. If the
 * callback returns `false`, traversal is stopped.
 *
 * @param {?string} start ID at which to start traversal.
 * @param {?string} stop ID at which to end traversal.
 * @param {function} cb Callback to invoke each ID with.
 * @param {?boolean} skipFirst Whether or not to skip the first node.
 * @param {?boolean} skipLast Whether or not to skip the last node.
 * @private
 */
function traverseParentPath(start, stop, cb, arg, skipFirst, skipLast) {
  start = start || '';
  stop = stop || '';
  ("production" !== process.env.NODE_ENV ? invariant(
    start !== stop,
    'traverseParentPath(...): Cannot traverse from and to the same ID, `%s`.',
    start
  ) : invariant(start !== stop));
  var traverseUp = isAncestorIDOf(stop, start);
  ("production" !== process.env.NODE_ENV ? invariant(
    traverseUp || isAncestorIDOf(start, stop),
    'traverseParentPath(%s, %s, ...): Cannot traverse from two IDs that do ' +
    'not have a parent path.',
    start,
    stop
  ) : invariant(traverseUp || isAncestorIDOf(start, stop)));
  // Traverse from `start` to `stop` one depth at a time.
  var depth = 0;
  var traverse = traverseUp ? getParentID : getNextDescendantID;
  for (var id = start; /* until break */; id = traverse(id, stop)) {
    var ret;
    if ((!skipFirst || id !== start) && (!skipLast || id !== stop)) {
      ret = cb(id, traverseUp, arg);
    }
    if (ret === false || id === stop) {
      // Only break //after// visiting `stop`.
      break;
    }
    ("production" !== process.env.NODE_ENV ? invariant(
      depth++ < MAX_TREE_DEPTH,
      'traverseParentPath(%s, %s, ...): Detected an infinite loop while ' +
      'traversing the React DOM ID tree. This may be due to malformed IDs: %s',
      start, stop
    ) : invariant(depth++ < MAX_TREE_DEPTH));
  }
}

/**
 * Manages the IDs assigned to DOM representations of React components. This
 * uses a specific scheme in order to traverse the DOM efficiently (e.g. in
 * order to simulate events).
 *
 * @internal
 */
var ReactInstanceHandles = {

  /**
   * Constructs a React root ID
   * @return {string} A React root ID.
   */
  createReactRootID: function() {
    return getReactRootIDString(ReactRootIndex.createReactRootIndex());
  },

  /**
   * Constructs a React ID by joining a root ID with a name.
   *
   * @param {string} rootID Root ID of a parent component.
   * @param {string} name A component's name (as flattened children).
   * @return {string} A React ID.
   * @internal
   */
  createReactID: function(rootID, name) {
    return rootID + name;
  },

  /**
   * Gets the DOM ID of the React component that is the root of the tree that
   * contains the React component with the supplied DOM ID.
   *
   * @param {string} id DOM ID of a React component.
   * @return {?string} DOM ID of the React component that is the root.
   * @internal
   */
  getReactRootIDFromNodeID: function(id) {
    if (id && id.charAt(0) === SEPARATOR && id.length > 1) {
      var index = id.indexOf(SEPARATOR, 1);
      return index > -1 ? id.substr(0, index) : id;
    }
    return null;
  },

  /**
   * Traverses the ID hierarchy and invokes the supplied `cb` on any IDs that
   * should would receive a `mouseEnter` or `mouseLeave` event.
   *
   * NOTE: Does not invoke the callback on the nearest common ancestor because
   * nothing "entered" or "left" that element.
   *
   * @param {string} leaveID ID being left.
   * @param {string} enterID ID being entered.
   * @param {function} cb Callback to invoke on each entered/left ID.
   * @param {*} upArg Argument to invoke the callback with on left IDs.
   * @param {*} downArg Argument to invoke the callback with on entered IDs.
   * @internal
   */
  traverseEnterLeave: function(leaveID, enterID, cb, upArg, downArg) {
    var ancestorID = getFirstCommonAncestorID(leaveID, enterID);
    if (ancestorID !== leaveID) {
      traverseParentPath(leaveID, ancestorID, cb, upArg, false, true);
    }
    if (ancestorID !== enterID) {
      traverseParentPath(ancestorID, enterID, cb, downArg, true, false);
    }
  },

  /**
   * Simulates the traversal of a two-phase, capture/bubble event dispatch.
   *
   * NOTE: This traversal happens on IDs without touching the DOM.
   *
   * @param {string} targetID ID of the target node.
   * @param {function} cb Callback to invoke.
   * @param {*} arg Argument to invoke the callback with.
   * @internal
   */
  traverseTwoPhase: function(targetID, cb, arg) {
    if (targetID) {
      traverseParentPath('', targetID, cb, arg, true, false);
      traverseParentPath(targetID, '', cb, arg, false, true);
    }
  },

  /**
   * Traverse a node ID, calling the supplied `cb` for each ancestor ID. For
   * example, passing `.0.$row-0.1` would result in `cb` getting called
   * with `.0`, `.0.$row-0`, and `.0.$row-0.1`.
   *
   * NOTE: This traversal happens on IDs without touching the DOM.
   *
   * @param {string} targetID ID of the target node.
   * @param {function} cb Callback to invoke.
   * @param {*} arg Argument to invoke the callback with.
   * @internal
   */
  traverseAncestors: function(targetID, cb, arg) {
    traverseParentPath('', targetID, cb, arg, true, false);
  },

  /**
   * Exposed for unit testing.
   * @private
   */
  _getFirstCommonAncestorID: getFirstCommonAncestorID,

  /**
   * Exposed for unit testing.
   * @private
   */
  _getNextDescendantID: getNextDescendantID,

  isAncestorIDOf: isAncestorIDOf,

  SEPARATOR: SEPARATOR

};

module.exports = ReactInstanceHandles;

}).call(this,require('_process'))
},{"./ReactRootIndex":108,"./invariant":160,"_process":28}],94:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactLegacyElement
 */

"use strict";

var ReactCurrentOwner = require("./ReactCurrentOwner");

var invariant = require("./invariant");
var monitorCodeUse = require("./monitorCodeUse");
var warning = require("./warning");

var legacyFactoryLogs = {};
function warnForLegacyFactoryCall() {
  if (!ReactLegacyElementFactory._isLegacyCallWarningEnabled) {
    return;
  }
  var owner = ReactCurrentOwner.current;
  var name = owner && owner.constructor ? owner.constructor.displayName : '';
  if (!name) {
    name = 'Something';
  }
  if (legacyFactoryLogs.hasOwnProperty(name)) {
    return;
  }
  legacyFactoryLogs[name] = true;
  ("production" !== process.env.NODE_ENV ? warning(
    false,
    name + ' is calling a React component directly. ' +
    'Use a factory or JSX instead. See: http://fb.me/react-legacyfactory'
  ) : null);
  monitorCodeUse('react_legacy_factory_call', { version: 3, name: name });
}

function warnForPlainFunctionType(type) {
  var isReactClass =
    type.prototype &&
    typeof type.prototype.mountComponent === 'function' &&
    typeof type.prototype.receiveComponent === 'function';
  if (isReactClass) {
    ("production" !== process.env.NODE_ENV ? warning(
      false,
      'Did not expect to get a React class here. Use `Component` instead ' +
      'of `Component.type` or `this.constructor`.'
    ) : null);
  } else {
    if (!type._reactWarnedForThisType) {
      try {
        type._reactWarnedForThisType = true;
      } catch (x) {
        // just incase this is a frozen object or some special object
      }
      monitorCodeUse(
        'react_non_component_in_jsx',
        { version: 3, name: type.name }
      );
    }
    ("production" !== process.env.NODE_ENV ? warning(
      false,
      'This JSX uses a plain function. Only React components are ' +
      'valid in React\'s JSX transform.'
    ) : null);
  }
}

function warnForNonLegacyFactory(type) {
  ("production" !== process.env.NODE_ENV ? warning(
    false,
    'Do not pass React.DOM.' + type.type + ' to JSX or createFactory. ' +
    'Use the string "' + type.type + '" instead.'
  ) : null);
}

/**
 * Transfer static properties from the source to the target. Functions are
 * rebound to have this reflect the original source.
 */
function proxyStaticMethods(target, source) {
  if (typeof source !== 'function') {
    return;
  }
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      var value = source[key];
      if (typeof value === 'function') {
        var bound = value.bind(source);
        // Copy any properties defined on the function, such as `isRequired` on
        // a PropTypes validator.
        for (var k in value) {
          if (value.hasOwnProperty(k)) {
            bound[k] = value[k];
          }
        }
        target[key] = bound;
      } else {
        target[key] = value;
      }
    }
  }
}

// We use an object instead of a boolean because booleans are ignored by our
// mocking libraries when these factories gets mocked.
var LEGACY_MARKER = {};
var NON_LEGACY_MARKER = {};

var ReactLegacyElementFactory = {};

ReactLegacyElementFactory.wrapCreateFactory = function(createFactory) {
  var legacyCreateFactory = function(type) {
    if (typeof type !== 'function') {
      // Non-function types cannot be legacy factories
      return createFactory(type);
    }

    if (type.isReactNonLegacyFactory) {
      // This is probably a factory created by ReactDOM we unwrap it to get to
      // the underlying string type. It shouldn't have been passed here so we
      // warn.
      if ("production" !== process.env.NODE_ENV) {
        warnForNonLegacyFactory(type);
      }
      return createFactory(type.type);
    }

    if (type.isReactLegacyFactory) {
      // This is probably a legacy factory created by ReactCompositeComponent.
      // We unwrap it to get to the underlying class.
      return createFactory(type.type);
    }

    if ("production" !== process.env.NODE_ENV) {
      warnForPlainFunctionType(type);
    }

    // Unless it's a legacy factory, then this is probably a plain function,
    // that is expecting to be invoked by JSX. We can just return it as is.
    return type;
  };
  return legacyCreateFactory;
};

ReactLegacyElementFactory.wrapCreateElement = function(createElement) {
  var legacyCreateElement = function(type, props, children) {
    if (typeof type !== 'function') {
      // Non-function types cannot be legacy factories
      return createElement.apply(this, arguments);
    }

    var args;

    if (type.isReactNonLegacyFactory) {
      // This is probably a factory created by ReactDOM we unwrap it to get to
      // the underlying string type. It shouldn't have been passed here so we
      // warn.
      if ("production" !== process.env.NODE_ENV) {
        warnForNonLegacyFactory(type);
      }
      args = Array.prototype.slice.call(arguments, 0);
      args[0] = type.type;
      return createElement.apply(this, args);
    }

    if (type.isReactLegacyFactory) {
      // This is probably a legacy factory created by ReactCompositeComponent.
      // We unwrap it to get to the underlying class.
      if (type._isMockFunction) {
        // If this is a mock function, people will expect it to be called. We
        // will actually call the original mock factory function instead. This
        // future proofs unit testing that assume that these are classes.
        type.type._mockedReactClassConstructor = type;
      }
      args = Array.prototype.slice.call(arguments, 0);
      args[0] = type.type;
      return createElement.apply(this, args);
    }

    if ("production" !== process.env.NODE_ENV) {
      warnForPlainFunctionType(type);
    }

    // This is being called with a plain function we should invoke it
    // immediately as if this was used with legacy JSX.
    return type.apply(null, Array.prototype.slice.call(arguments, 1));
  };
  return legacyCreateElement;
};

ReactLegacyElementFactory.wrapFactory = function(factory) {
  ("production" !== process.env.NODE_ENV ? invariant(
    typeof factory === 'function',
    'This is suppose to accept a element factory'
  ) : invariant(typeof factory === 'function'));
  var legacyElementFactory = function(config, children) {
    // This factory should not be called when JSX is used. Use JSX instead.
    if ("production" !== process.env.NODE_ENV) {
      warnForLegacyFactoryCall();
    }
    return factory.apply(this, arguments);
  };
  proxyStaticMethods(legacyElementFactory, factory.type);
  legacyElementFactory.isReactLegacyFactory = LEGACY_MARKER;
  legacyElementFactory.type = factory.type;
  return legacyElementFactory;
};

// This is used to mark a factory that will remain. E.g. we're allowed to call
// it as a function. However, you're not suppose to pass it to createElement
// or createFactory, so it will warn you if you do.
ReactLegacyElementFactory.markNonLegacyFactory = function(factory) {
  factory.isReactNonLegacyFactory = NON_LEGACY_MARKER;
  return factory;
};

// Checks if a factory function is actually a legacy factory pretending to
// be a class.
ReactLegacyElementFactory.isValidFactory = function(factory) {
  // TODO: This will be removed and moved into a class validator or something.
  return typeof factory === 'function' &&
    factory.isReactLegacyFactory === LEGACY_MARKER;
};

ReactLegacyElementFactory.isValidClass = function(factory) {
  if ("production" !== process.env.NODE_ENV) {
    ("production" !== process.env.NODE_ENV ? warning(
      false,
      'isValidClass is deprecated and will be removed in a future release. ' +
      'Use a more specific validator instead.'
    ) : null);
  }
  return ReactLegacyElementFactory.isValidFactory(factory);
};

ReactLegacyElementFactory._isLegacyCallWarningEnabled = true;

module.exports = ReactLegacyElementFactory;

}).call(this,require('_process'))
},{"./ReactCurrentOwner":69,"./invariant":160,"./monitorCodeUse":170,"./warning":179,"_process":28}],95:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactMarkupChecksum
 */

"use strict";

var adler32 = require("./adler32");

var ReactMarkupChecksum = {
  CHECKSUM_ATTR_NAME: 'data-react-checksum',

  /**
   * @param {string} markup Markup string
   * @return {string} Markup string with checksum attribute attached
   */
  addChecksumToMarkup: function(markup) {
    var checksum = adler32(markup);
    return markup.replace(
      '>',
      ' ' + ReactMarkupChecksum.CHECKSUM_ATTR_NAME + '="' + checksum + '">'
    );
  },

  /**
   * @param {string} markup to use
   * @param {DOMElement} element root React element
   * @returns {boolean} whether or not the markup is the same
   */
  canReuseMarkup: function(markup, element) {
    var existingChecksum = element.getAttribute(
      ReactMarkupChecksum.CHECKSUM_ATTR_NAME
    );
    existingChecksum = existingChecksum && parseInt(existingChecksum, 10);
    var markupChecksum = adler32(markup);
    return markupChecksum === existingChecksum;
  }
};

module.exports = ReactMarkupChecksum;

},{"./adler32":131}],96:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactMount
 */

"use strict";

var DOMProperty = require("./DOMProperty");
var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactElement = require("./ReactElement");
var ReactLegacyElement = require("./ReactLegacyElement");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactPerf = require("./ReactPerf");

var containsNode = require("./containsNode");
var deprecated = require("./deprecated");
var getReactRootElementInContainer = require("./getReactRootElementInContainer");
var instantiateReactComponent = require("./instantiateReactComponent");
var invariant = require("./invariant");
var shouldUpdateReactComponent = require("./shouldUpdateReactComponent");
var warning = require("./warning");

var createElement = ReactLegacyElement.wrapCreateElement(
  ReactElement.createElement
);

var SEPARATOR = ReactInstanceHandles.SEPARATOR;

var ATTR_NAME = DOMProperty.ID_ATTRIBUTE_NAME;
var nodeCache = {};

var ELEMENT_NODE_TYPE = 1;
var DOC_NODE_TYPE = 9;

/** Mapping from reactRootID to React component instance. */
var instancesByReactRootID = {};

/** Mapping from reactRootID to `container` nodes. */
var containersByReactRootID = {};

if ("production" !== process.env.NODE_ENV) {
  /** __DEV__-only mapping from reactRootID to root elements. */
  var rootElementsByReactRootID = {};
}

// Used to store breadth-first search state in findComponentRoot.
var findComponentRootReusableArray = [];

/**
 * @param {DOMElement} container DOM element that may contain a React component.
 * @return {?string} A "reactRoot" ID, if a React component is rendered.
 */
function getReactRootID(container) {
  var rootElement = getReactRootElementInContainer(container);
  return rootElement && ReactMount.getID(rootElement);
}

/**
 * Accessing node[ATTR_NAME] or calling getAttribute(ATTR_NAME) on a form
 * element can return its control whose name or ID equals ATTR_NAME. All
 * DOM nodes support `getAttributeNode` but this can also get called on
 * other objects so just return '' if we're given something other than a
 * DOM node (such as window).
 *
 * @param {?DOMElement|DOMWindow|DOMDocument|DOMTextNode} node DOM node.
 * @return {string} ID of the supplied `domNode`.
 */
function getID(node) {
  var id = internalGetID(node);
  if (id) {
    if (nodeCache.hasOwnProperty(id)) {
      var cached = nodeCache[id];
      if (cached !== node) {
        ("production" !== process.env.NODE_ENV ? invariant(
          !isValid(cached, id),
          'ReactMount: Two valid but unequal nodes with the same `%s`: %s',
          ATTR_NAME, id
        ) : invariant(!isValid(cached, id)));

        nodeCache[id] = node;
      }
    } else {
      nodeCache[id] = node;
    }
  }

  return id;
}

function internalGetID(node) {
  // If node is something like a window, document, or text node, none of
  // which support attributes or a .getAttribute method, gracefully return
  // the empty string, as if the attribute were missing.
  return node && node.getAttribute && node.getAttribute(ATTR_NAME) || '';
}

/**
 * Sets the React-specific ID of the given node.
 *
 * @param {DOMElement} node The DOM node whose ID will be set.
 * @param {string} id The value of the ID attribute.
 */
function setID(node, id) {
  var oldID = internalGetID(node);
  if (oldID !== id) {
    delete nodeCache[oldID];
  }
  node.setAttribute(ATTR_NAME, id);
  nodeCache[id] = node;
}

/**
 * Finds the node with the supplied React-generated DOM ID.
 *
 * @param {string} id A React-generated DOM ID.
 * @return {DOMElement} DOM node with the suppled `id`.
 * @internal
 */
function getNode(id) {
  if (!nodeCache.hasOwnProperty(id) || !isValid(nodeCache[id], id)) {
    nodeCache[id] = ReactMount.findReactNodeByID(id);
  }
  return nodeCache[id];
}

/**
 * A node is "valid" if it is contained by a currently mounted container.
 *
 * This means that the node does not have to be contained by a document in
 * order to be considered valid.
 *
 * @param {?DOMElement} node The candidate DOM node.
 * @param {string} id The expected ID of the node.
 * @return {boolean} Whether the node is contained by a mounted container.
 */
function isValid(node, id) {
  if (node) {
    ("production" !== process.env.NODE_ENV ? invariant(
      internalGetID(node) === id,
      'ReactMount: Unexpected modification of `%s`',
      ATTR_NAME
    ) : invariant(internalGetID(node) === id));

    var container = ReactMount.findReactContainerForID(id);
    if (container && containsNode(container, node)) {
      return true;
    }
  }

  return false;
}

/**
 * Causes the cache to forget about one React-specific ID.
 *
 * @param {string} id The ID to forget.
 */
function purgeID(id) {
  delete nodeCache[id];
}

var deepestNodeSoFar = null;
function findDeepestCachedAncestorImpl(ancestorID) {
  var ancestor = nodeCache[ancestorID];
  if (ancestor && isValid(ancestor, ancestorID)) {
    deepestNodeSoFar = ancestor;
  } else {
    // This node isn't populated in the cache, so presumably none of its
    // descendants are. Break out of the loop.
    return false;
  }
}

/**
 * Return the deepest cached node whose ID is a prefix of `targetID`.
 */
function findDeepestCachedAncestor(targetID) {
  deepestNodeSoFar = null;
  ReactInstanceHandles.traverseAncestors(
    targetID,
    findDeepestCachedAncestorImpl
  );

  var foundNode = deepestNodeSoFar;
  deepestNodeSoFar = null;
  return foundNode;
}

/**
 * Mounting is the process of initializing a React component by creatings its
 * representative DOM elements and inserting them into a supplied `container`.
 * Any prior content inside `container` is destroyed in the process.
 *
 *   ReactMount.render(
 *     component,
 *     document.getElementById('container')
 *   );
 *
 *   <div id="container">                   <-- Supplied `container`.
 *     <div data-reactid=".3">              <-- Rendered reactRoot of React
 *       // ...                                 component.
 *     </div>
 *   </div>
 *
 * Inside of `container`, the first element rendered is the "reactRoot".
 */
var ReactMount = {
  /** Exposed for debugging purposes **/
  _instancesByReactRootID: instancesByReactRootID,

  /**
   * This is a hook provided to support rendering React components while
   * ensuring that the apparent scroll position of its `container` does not
   * change.
   *
   * @param {DOMElement} container The `container` being rendered into.
   * @param {function} renderCallback This must be called once to do the render.
   */
  scrollMonitor: function(container, renderCallback) {
    renderCallback();
  },

  /**
   * Take a component that's already mounted into the DOM and replace its props
   * @param {ReactComponent} prevComponent component instance already in the DOM
   * @param {ReactComponent} nextComponent component instance to render
   * @param {DOMElement} container container to render into
   * @param {?function} callback function triggered on completion
   */
  _updateRootComponent: function(
      prevComponent,
      nextComponent,
      container,
      callback) {
    var nextProps = nextComponent.props;
    ReactMount.scrollMonitor(container, function() {
      prevComponent.replaceProps(nextProps, callback);
    });

    if ("production" !== process.env.NODE_ENV) {
      // Record the root element in case it later gets transplanted.
      rootElementsByReactRootID[getReactRootID(container)] =
        getReactRootElementInContainer(container);
    }

    return prevComponent;
  },

  /**
   * Register a component into the instance map and starts scroll value
   * monitoring
   * @param {ReactComponent} nextComponent component instance to render
   * @param {DOMElement} container container to render into
   * @return {string} reactRoot ID prefix
   */
  _registerComponent: function(nextComponent, container) {
    ("production" !== process.env.NODE_ENV ? invariant(
      container && (
        container.nodeType === ELEMENT_NODE_TYPE ||
        container.nodeType === DOC_NODE_TYPE
      ),
      '_registerComponent(...): Target container is not a DOM element.'
    ) : invariant(container && (
      container.nodeType === ELEMENT_NODE_TYPE ||
      container.nodeType === DOC_NODE_TYPE
    )));

    ReactBrowserEventEmitter.ensureScrollValueMonitoring();

    var reactRootID = ReactMount.registerContainer(container);
    instancesByReactRootID[reactRootID] = nextComponent;
    return reactRootID;
  },

  /**
   * Render a new component into the DOM.
   * @param {ReactComponent} nextComponent component instance to render
   * @param {DOMElement} container container to render into
   * @param {boolean} shouldReuseMarkup if we should skip the markup insertion
   * @return {ReactComponent} nextComponent
   */
  _renderNewRootComponent: ReactPerf.measure(
    'ReactMount',
    '_renderNewRootComponent',
    function(
        nextComponent,
        container,
        shouldReuseMarkup) {
      // Various parts of our code (such as ReactCompositeComponent's
      // _renderValidatedComponent) assume that calls to render aren't nested;
      // verify that that's the case.
      ("production" !== process.env.NODE_ENV ? warning(
        ReactCurrentOwner.current == null,
        '_renderNewRootComponent(): Render methods should be a pure function ' +
        'of props and state; triggering nested component updates from ' +
        'render is not allowed. If necessary, trigger nested updates in ' +
        'componentDidUpdate.'
      ) : null);

      var componentInstance = instantiateReactComponent(nextComponent, null);
      var reactRootID = ReactMount._registerComponent(
        componentInstance,
        container
      );
      componentInstance.mountComponentIntoNode(
        reactRootID,
        container,
        shouldReuseMarkup
      );

      if ("production" !== process.env.NODE_ENV) {
        // Record the root element in case it later gets transplanted.
        rootElementsByReactRootID[reactRootID] =
          getReactRootElementInContainer(container);
      }

      return componentInstance;
    }
  ),

  /**
   * Renders a React component into the DOM in the supplied `container`.
   *
   * If the React component was previously rendered into `container`, this will
   * perform an update on it and only mutate the DOM as necessary to reflect the
   * latest React component.
   *
   * @param {ReactElement} nextElement Component element to render.
   * @param {DOMElement} container DOM element to render into.
   * @param {?function} callback function triggered on completion
   * @return {ReactComponent} Component instance rendered in `container`.
   */
  render: function(nextElement, container, callback) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ReactElement.isValidElement(nextElement),
      'renderComponent(): Invalid component element.%s',
      (
        typeof nextElement === 'string' ?
          ' Instead of passing an element string, make sure to instantiate ' +
          'it by passing it to React.createElement.' :
        ReactLegacyElement.isValidFactory(nextElement) ?
          ' Instead of passing a component class, make sure to instantiate ' +
          'it by passing it to React.createElement.' :
        // Check if it quacks like a element
        typeof nextElement.props !== "undefined" ?
          ' This may be caused by unintentionally loading two independent ' +
          'copies of React.' :
          ''
      )
    ) : invariant(ReactElement.isValidElement(nextElement)));

    var prevComponent = instancesByReactRootID[getReactRootID(container)];

    if (prevComponent) {
      var prevElement = prevComponent._currentElement;
      if (shouldUpdateReactComponent(prevElement, nextElement)) {
        return ReactMount._updateRootComponent(
          prevComponent,
          nextElement,
          container,
          callback
        );
      } else {
        ReactMount.unmountComponentAtNode(container);
      }
    }

    var reactRootElement = getReactRootElementInContainer(container);
    var containerHasReactMarkup =
      reactRootElement && ReactMount.isRenderedByReact(reactRootElement);

    var shouldReuseMarkup = containerHasReactMarkup && !prevComponent;

    var component = ReactMount._renderNewRootComponent(
      nextElement,
      container,
      shouldReuseMarkup
    );
    callback && callback.call(component);
    return component;
  },

  /**
   * Constructs a component instance of `constructor` with `initialProps` and
   * renders it into the supplied `container`.
   *
   * @param {function} constructor React component constructor.
   * @param {?object} props Initial props of the component instance.
   * @param {DOMElement} container DOM element to render into.
   * @return {ReactComponent} Component instance rendered in `container`.
   */
  constructAndRenderComponent: function(constructor, props, container) {
    var element = createElement(constructor, props);
    return ReactMount.render(element, container);
  },

  /**
   * Constructs a component instance of `constructor` with `initialProps` and
   * renders it into a container node identified by supplied `id`.
   *
   * @param {function} componentConstructor React component constructor
   * @param {?object} props Initial props of the component instance.
   * @param {string} id ID of the DOM element to render into.
   * @return {ReactComponent} Component instance rendered in the container node.
   */
  constructAndRenderComponentByID: function(constructor, props, id) {
    var domNode = document.getElementById(id);
    ("production" !== process.env.NODE_ENV ? invariant(
      domNode,
      'Tried to get element with id of "%s" but it is not present on the page.',
      id
    ) : invariant(domNode));
    return ReactMount.constructAndRenderComponent(constructor, props, domNode);
  },

  /**
   * Registers a container node into which React components will be rendered.
   * This also creates the "reactRoot" ID that will be assigned to the element
   * rendered within.
   *
   * @param {DOMElement} container DOM element to register as a container.
   * @return {string} The "reactRoot" ID of elements rendered within.
   */
  registerContainer: function(container) {
    var reactRootID = getReactRootID(container);
    if (reactRootID) {
      // If one exists, make sure it is a valid "reactRoot" ID.
      reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(reactRootID);
    }
    if (!reactRootID) {
      // No valid "reactRoot" ID found, create one.
      reactRootID = ReactInstanceHandles.createReactRootID();
    }
    containersByReactRootID[reactRootID] = container;
    return reactRootID;
  },

  /**
   * Unmounts and destroys the React component rendered in the `container`.
   *
   * @param {DOMElement} container DOM element containing a React component.
   * @return {boolean} True if a component was found in and unmounted from
   *                   `container`
   */
  unmountComponentAtNode: function(container) {
    // Various parts of our code (such as ReactCompositeComponent's
    // _renderValidatedComponent) assume that calls to render aren't nested;
    // verify that that's the case. (Strictly speaking, unmounting won't cause a
    // render but we still don't expect to be in a render call here.)
    ("production" !== process.env.NODE_ENV ? warning(
      ReactCurrentOwner.current == null,
      'unmountComponentAtNode(): Render methods should be a pure function of ' +
      'props and state; triggering nested component updates from render is ' +
      'not allowed. If necessary, trigger nested updates in ' +
      'componentDidUpdate.'
    ) : null);

    var reactRootID = getReactRootID(container);
    var component = instancesByReactRootID[reactRootID];
    if (!component) {
      return false;
    }
    ReactMount.unmountComponentFromNode(component, container);
    delete instancesByReactRootID[reactRootID];
    delete containersByReactRootID[reactRootID];
    if ("production" !== process.env.NODE_ENV) {
      delete rootElementsByReactRootID[reactRootID];
    }
    return true;
  },

  /**
   * Unmounts a component and removes it from the DOM.
   *
   * @param {ReactComponent} instance React component instance.
   * @param {DOMElement} container DOM element to unmount from.
   * @final
   * @internal
   * @see {ReactMount.unmountComponentAtNode}
   */
  unmountComponentFromNode: function(instance, container) {
    instance.unmountComponent();

    if (container.nodeType === DOC_NODE_TYPE) {
      container = container.documentElement;
    }

    // http://jsperf.com/emptying-a-node
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    }
  },

  /**
   * Finds the container DOM element that contains React component to which the
   * supplied DOM `id` belongs.
   *
   * @param {string} id The ID of an element rendered by a React component.
   * @return {?DOMElement} DOM element that contains the `id`.
   */
  findReactContainerForID: function(id) {
    var reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(id);
    var container = containersByReactRootID[reactRootID];

    if ("production" !== process.env.NODE_ENV) {
      var rootElement = rootElementsByReactRootID[reactRootID];
      if (rootElement && rootElement.parentNode !== container) {
        ("production" !== process.env.NODE_ENV ? invariant(
          // Call internalGetID here because getID calls isValid which calls
          // findReactContainerForID (this function).
          internalGetID(rootElement) === reactRootID,
          'ReactMount: Root element ID differed from reactRootID.'
        ) : invariant(// Call internalGetID here because getID calls isValid which calls
        // findReactContainerForID (this function).
        internalGetID(rootElement) === reactRootID));

        var containerChild = container.firstChild;
        if (containerChild &&
            reactRootID === internalGetID(containerChild)) {
          // If the container has a new child with the same ID as the old
          // root element, then rootElementsByReactRootID[reactRootID] is
          // just stale and needs to be updated. The case that deserves a
          // warning is when the container is empty.
          rootElementsByReactRootID[reactRootID] = containerChild;
        } else {
          console.warn(
            'ReactMount: Root element has been removed from its original ' +
            'container. New container:', rootElement.parentNode
          );
        }
      }
    }

    return container;
  },

  /**
   * Finds an element rendered by React with the supplied ID.
   *
   * @param {string} id ID of a DOM node in the React component.
   * @return {DOMElement} Root DOM node of the React component.
   */
  findReactNodeByID: function(id) {
    var reactRoot = ReactMount.findReactContainerForID(id);
    return ReactMount.findComponentRoot(reactRoot, id);
  },

  /**
   * True if the supplied `node` is rendered by React.
   *
   * @param {*} node DOM Element to check.
   * @return {boolean} True if the DOM Element appears to be rendered by React.
   * @internal
   */
  isRenderedByReact: function(node) {
    if (node.nodeType !== 1) {
      // Not a DOMElement, therefore not a React component
      return false;
    }
    var id = ReactMount.getID(node);
    return id ? id.charAt(0) === SEPARATOR : false;
  },

  /**
   * Traverses up the ancestors of the supplied node to find a node that is a
   * DOM representation of a React component.
   *
   * @param {*} node
   * @return {?DOMEventTarget}
   * @internal
   */
  getFirstReactDOM: function(node) {
    var current = node;
    while (current && current.parentNode !== current) {
      if (ReactMount.isRenderedByReact(current)) {
        return current;
      }
      current = current.parentNode;
    }
    return null;
  },

  /**
   * Finds a node with the supplied `targetID` inside of the supplied
   * `ancestorNode`.  Exploits the ID naming scheme to perform the search
   * quickly.
   *
   * @param {DOMEventTarget} ancestorNode Search from this root.
   * @pararm {string} targetID ID of the DOM representation of the component.
   * @return {DOMEventTarget} DOM node with the supplied `targetID`.
   * @internal
   */
  findComponentRoot: function(ancestorNode, targetID) {
    var firstChildren = findComponentRootReusableArray;
    var childIndex = 0;

    var deepestAncestor = findDeepestCachedAncestor(targetID) || ancestorNode;

    firstChildren[0] = deepestAncestor.firstChild;
    firstChildren.length = 1;

    while (childIndex < firstChildren.length) {
      var child = firstChildren[childIndex++];
      var targetChild;

      while (child) {
        var childID = ReactMount.getID(child);
        if (childID) {
          // Even if we find the node we're looking for, we finish looping
          // through its siblings to ensure they're cached so that we don't have
          // to revisit this node again. Otherwise, we make n^2 calls to getID
          // when visiting the many children of a single node in order.

          if (targetID === childID) {
            targetChild = child;
          } else if (ReactInstanceHandles.isAncestorIDOf(childID, targetID)) {
            // If we find a child whose ID is an ancestor of the given ID,
            // then we can be sure that we only want to search the subtree
            // rooted at this child, so we can throw out the rest of the
            // search state.
            firstChildren.length = childIndex = 0;
            firstChildren.push(child.firstChild);
          }

        } else {
          // If this child had no ID, then there's a chance that it was
          // injected automatically by the browser, as when a `<table>`
          // element sprouts an extra `<tbody>` child as a side effect of
          // `.innerHTML` parsing. Optimistically continue down this
          // branch, but not before examining the other siblings.
          firstChildren.push(child.firstChild);
        }

        child = child.nextSibling;
      }

      if (targetChild) {
        // Emptying firstChildren/findComponentRootReusableArray is
        // not necessary for correctness, but it helps the GC reclaim
        // any nodes that were left at the end of the search.
        firstChildren.length = 0;

        return targetChild;
      }
    }

    firstChildren.length = 0;

    ("production" !== process.env.NODE_ENV ? invariant(
      false,
      'findComponentRoot(..., %s): Unable to find element. This probably ' +
      'means the DOM was unexpectedly mutated (e.g., by the browser), ' +
      'usually due to forgetting a <tbody> when using tables, nesting tags ' +
      'like <form>, <p>, or <a>, or using non-SVG elements in an <svg> ' +
      'parent. ' +
      'Try inspecting the child nodes of the element with React ID `%s`.',
      targetID,
      ReactMount.getID(ancestorNode)
    ) : invariant(false));
  },


  /**
   * React ID utilities.
   */

  getReactRootID: getReactRootID,

  getID: getID,

  setID: setID,

  getNode: getNode,

  purgeID: purgeID
};

// Deprecations (remove for 0.13)
ReactMount.renderComponent = deprecated(
  'ReactMount',
  'renderComponent',
  'render',
  this,
  ReactMount.render
);

module.exports = ReactMount;

}).call(this,require('_process'))
},{"./DOMProperty":43,"./ReactBrowserEventEmitter":63,"./ReactCurrentOwner":69,"./ReactElement":85,"./ReactInstanceHandles":93,"./ReactLegacyElement":94,"./ReactPerf":101,"./containsNode":134,"./deprecated":140,"./getReactRootElementInContainer":154,"./instantiateReactComponent":159,"./invariant":160,"./shouldUpdateReactComponent":176,"./warning":179,"_process":28}],97:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactMultiChild
 * @typechecks static-only
 */

"use strict";

var ReactComponent = require("./ReactComponent");
var ReactMultiChildUpdateTypes = require("./ReactMultiChildUpdateTypes");

var flattenChildren = require("./flattenChildren");
var instantiateReactComponent = require("./instantiateReactComponent");
var shouldUpdateReactComponent = require("./shouldUpdateReactComponent");

/**
 * Updating children of a component may trigger recursive updates. The depth is
 * used to batch recursive updates to render markup more efficiently.
 *
 * @type {number}
 * @private
 */
var updateDepth = 0;

/**
 * Queue of update configuration objects.
 *
 * Each object has a `type` property that is in `ReactMultiChildUpdateTypes`.
 *
 * @type {array<object>}
 * @private
 */
var updateQueue = [];

/**
 * Queue of markup to be rendered.
 *
 * @type {array<string>}
 * @private
 */
var markupQueue = [];

/**
 * Enqueues markup to be rendered and inserted at a supplied index.
 *
 * @param {string} parentID ID of the parent component.
 * @param {string} markup Markup that renders into an element.
 * @param {number} toIndex Destination index.
 * @private
 */
function enqueueMarkup(parentID, markup, toIndex) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.INSERT_MARKUP,
    markupIndex: markupQueue.push(markup) - 1,
    textContent: null,
    fromIndex: null,
    toIndex: toIndex
  });
}

/**
 * Enqueues moving an existing element to another index.
 *
 * @param {string} parentID ID of the parent component.
 * @param {number} fromIndex Source index of the existing element.
 * @param {number} toIndex Destination index of the element.
 * @private
 */
function enqueueMove(parentID, fromIndex, toIndex) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.MOVE_EXISTING,
    markupIndex: null,
    textContent: null,
    fromIndex: fromIndex,
    toIndex: toIndex
  });
}

/**
 * Enqueues removing an element at an index.
 *
 * @param {string} parentID ID of the parent component.
 * @param {number} fromIndex Index of the element to remove.
 * @private
 */
function enqueueRemove(parentID, fromIndex) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.REMOVE_NODE,
    markupIndex: null,
    textContent: null,
    fromIndex: fromIndex,
    toIndex: null
  });
}

/**
 * Enqueues setting the text content.
 *
 * @param {string} parentID ID of the parent component.
 * @param {string} textContent Text content to set.
 * @private
 */
function enqueueTextContent(parentID, textContent) {
  // NOTE: Null values reduce hidden classes.
  updateQueue.push({
    parentID: parentID,
    parentNode: null,
    type: ReactMultiChildUpdateTypes.TEXT_CONTENT,
    markupIndex: null,
    textContent: textContent,
    fromIndex: null,
    toIndex: null
  });
}

/**
 * Processes any enqueued updates.
 *
 * @private
 */
function processQueue() {
  if (updateQueue.length) {
    ReactComponent.BackendIDOperations.dangerouslyProcessChildrenUpdates(
      updateQueue,
      markupQueue
    );
    clearQueue();
  }
}

/**
 * Clears any enqueued updates.
 *
 * @private
 */
function clearQueue() {
  updateQueue.length = 0;
  markupQueue.length = 0;
}

/**
 * ReactMultiChild are capable of reconciling multiple children.
 *
 * @class ReactMultiChild
 * @internal
 */
var ReactMultiChild = {

  /**
   * Provides common functionality for components that must reconcile multiple
   * children. This is used by `ReactDOMComponent` to mount, update, and
   * unmount child components.
   *
   * @lends {ReactMultiChild.prototype}
   */
  Mixin: {

    /**
     * Generates a "mount image" for each of the supplied children. In the case
     * of `ReactDOMComponent`, a mount image is a string of markup.
     *
     * @param {?object} nestedChildren Nested child maps.
     * @return {array} An array of mounted representations.
     * @internal
     */
    mountChildren: function(nestedChildren, transaction) {
      var children = flattenChildren(nestedChildren);
      var mountImages = [];
      var index = 0;
      this._renderedChildren = children;
      for (var name in children) {
        var child = children[name];
        if (children.hasOwnProperty(name)) {
          // The rendered children must be turned into instances as they're
          // mounted.
          var childInstance = instantiateReactComponent(child, null);
          children[name] = childInstance;
          // Inlined for performance, see `ReactInstanceHandles.createReactID`.
          var rootID = this._rootNodeID + name;
          var mountImage = childInstance.mountComponent(
            rootID,
            transaction,
            this._mountDepth + 1
          );
          childInstance._mountIndex = index;
          mountImages.push(mountImage);
          index++;
        }
      }
      return mountImages;
    },

    /**
     * Replaces any rendered children with a text content string.
     *
     * @param {string} nextContent String of content.
     * @internal
     */
    updateTextContent: function(nextContent) {
      updateDepth++;
      var errorThrown = true;
      try {
        var prevChildren = this._renderedChildren;
        // Remove any rendered children.
        for (var name in prevChildren) {
          if (prevChildren.hasOwnProperty(name)) {
            this._unmountChildByName(prevChildren[name], name);
          }
        }
        // Set new text content.
        this.setTextContent(nextContent);
        errorThrown = false;
      } finally {
        updateDepth--;
        if (!updateDepth) {
          errorThrown ? clearQueue() : processQueue();
        }
      }
    },

    /**
     * Updates the rendered children with new children.
     *
     * @param {?object} nextNestedChildren Nested child maps.
     * @param {ReactReconcileTransaction} transaction
     * @internal
     */
    updateChildren: function(nextNestedChildren, transaction) {
      updateDepth++;
      var errorThrown = true;
      try {
        this._updateChildren(nextNestedChildren, transaction);
        errorThrown = false;
      } finally {
        updateDepth--;
        if (!updateDepth) {
          errorThrown ? clearQueue() : processQueue();
        }
      }
    },

    /**
     * Improve performance by isolating this hot code path from the try/catch
     * block in `updateChildren`.
     *
     * @param {?object} nextNestedChildren Nested child maps.
     * @param {ReactReconcileTransaction} transaction
     * @final
     * @protected
     */
    _updateChildren: function(nextNestedChildren, transaction) {
      var nextChildren = flattenChildren(nextNestedChildren);
      var prevChildren = this._renderedChildren;
      if (!nextChildren && !prevChildren) {
        return;
      }
      var name;
      // `nextIndex` will increment for each child in `nextChildren`, but
      // `lastIndex` will be the last index visited in `prevChildren`.
      var lastIndex = 0;
      var nextIndex = 0;
      for (name in nextChildren) {
        if (!nextChildren.hasOwnProperty(name)) {
          continue;
        }
        var prevChild = prevChildren && prevChildren[name];
        var prevElement = prevChild && prevChild._currentElement;
        var nextElement = nextChildren[name];
        if (shouldUpdateReactComponent(prevElement, nextElement)) {
          this.moveChild(prevChild, nextIndex, lastIndex);
          lastIndex = Math.max(prevChild._mountIndex, lastIndex);
          prevChild.receiveComponent(nextElement, transaction);
          prevChild._mountIndex = nextIndex;
        } else {
          if (prevChild) {
            // Update `lastIndex` before `_mountIndex` gets unset by unmounting.
            lastIndex = Math.max(prevChild._mountIndex, lastIndex);
            this._unmountChildByName(prevChild, name);
          }
          // The child must be instantiated before it's mounted.
          var nextChildInstance = instantiateReactComponent(
            nextElement,
            null
          );
          this._mountChildByNameAtIndex(
            nextChildInstance, name, nextIndex, transaction
          );
        }
        nextIndex++;
      }
      // Remove children that are no longer present.
      for (name in prevChildren) {
        if (prevChildren.hasOwnProperty(name) &&
            !(nextChildren && nextChildren[name])) {
          this._unmountChildByName(prevChildren[name], name);
        }
      }
    },

    /**
     * Unmounts all rendered children. This should be used to clean up children
     * when this component is unmounted.
     *
     * @internal
     */
    unmountChildren: function() {
      var renderedChildren = this._renderedChildren;
      for (var name in renderedChildren) {
        var renderedChild = renderedChildren[name];
        // TODO: When is this not true?
        if (renderedChild.unmountComponent) {
          renderedChild.unmountComponent();
        }
      }
      this._renderedChildren = null;
    },

    /**
     * Moves a child component to the supplied index.
     *
     * @param {ReactComponent} child Component to move.
     * @param {number} toIndex Destination index of the element.
     * @param {number} lastIndex Last index visited of the siblings of `child`.
     * @protected
     */
    moveChild: function(child, toIndex, lastIndex) {
      // If the index of `child` is less than `lastIndex`, then it needs to
      // be moved. Otherwise, we do not need to move it because a child will be
      // inserted or moved before `child`.
      if (child._mountIndex < lastIndex) {
        enqueueMove(this._rootNodeID, child._mountIndex, toIndex);
      }
    },

    /**
     * Creates a child component.
     *
     * @param {ReactComponent} child Component to create.
     * @param {string} mountImage Markup to insert.
     * @protected
     */
    createChild: function(child, mountImage) {
      enqueueMarkup(this._rootNodeID, mountImage, child._mountIndex);
    },

    /**
     * Removes a child component.
     *
     * @param {ReactComponent} child Child to remove.
     * @protected
     */
    removeChild: function(child) {
      enqueueRemove(this._rootNodeID, child._mountIndex);
    },

    /**
     * Sets this text content string.
     *
     * @param {string} textContent Text content to set.
     * @protected
     */
    setTextContent: function(textContent) {
      enqueueTextContent(this._rootNodeID, textContent);
    },

    /**
     * Mounts a child with the supplied name.
     *
     * NOTE: This is part of `updateChildren` and is here for readability.
     *
     * @param {ReactComponent} child Component to mount.
     * @param {string} name Name of the child.
     * @param {number} index Index at which to insert the child.
     * @param {ReactReconcileTransaction} transaction
     * @private
     */
    _mountChildByNameAtIndex: function(child, name, index, transaction) {
      // Inlined for performance, see `ReactInstanceHandles.createReactID`.
      var rootID = this._rootNodeID + name;
      var mountImage = child.mountComponent(
        rootID,
        transaction,
        this._mountDepth + 1
      );
      child._mountIndex = index;
      this.createChild(child, mountImage);
      this._renderedChildren = this._renderedChildren || {};
      this._renderedChildren[name] = child;
    },

    /**
     * Unmounts a rendered child by name.
     *
     * NOTE: This is part of `updateChildren` and is here for readability.
     *
     * @param {ReactComponent} child Component to unmount.
     * @param {string} name Name of the child in `this._renderedChildren`.
     * @private
     */
    _unmountChildByName: function(child, name) {
      this.removeChild(child);
      child._mountIndex = null;
      child.unmountComponent();
      delete this._renderedChildren[name];
    }

  }

};

module.exports = ReactMultiChild;

},{"./ReactComponent":65,"./ReactMultiChildUpdateTypes":98,"./flattenChildren":144,"./instantiateReactComponent":159,"./shouldUpdateReactComponent":176}],98:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactMultiChildUpdateTypes
 */

"use strict";

var keyMirror = require("./keyMirror");

/**
 * When a component's children are updated, a series of update configuration
 * objects are created in order to batch and serialize the required changes.
 *
 * Enumerates all the possible types of update configurations.
 *
 * @internal
 */
var ReactMultiChildUpdateTypes = keyMirror({
  INSERT_MARKUP: null,
  MOVE_EXISTING: null,
  REMOVE_NODE: null,
  TEXT_CONTENT: null
});

module.exports = ReactMultiChildUpdateTypes;

},{"./keyMirror":166}],99:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactNativeComponent
 */

"use strict";

var assign = require("./Object.assign");
var invariant = require("./invariant");

var genericComponentClass = null;
// This registry keeps track of wrapper classes around native tags
var tagToComponentClass = {};

var ReactNativeComponentInjection = {
  // This accepts a class that receives the tag string. This is a catch all
  // that can render any kind of tag.
  injectGenericComponentClass: function(componentClass) {
    genericComponentClass = componentClass;
  },
  // This accepts a keyed object with classes as values. Each key represents a
  // tag. That particular tag will use this class instead of the generic one.
  injectComponentClasses: function(componentClasses) {
    assign(tagToComponentClass, componentClasses);
  }
};

/**
 * Create an internal class for a specific tag.
 *
 * @param {string} tag The tag for which to create an internal instance.
 * @param {any} props The props passed to the instance constructor.
 * @return {ReactComponent} component The injected empty component.
 */
function createInstanceForTag(tag, props, parentType) {
  var componentClass = tagToComponentClass[tag];
  if (componentClass == null) {
    ("production" !== process.env.NODE_ENV ? invariant(
      genericComponentClass,
      'There is no registered component for the tag %s',
      tag
    ) : invariant(genericComponentClass));
    return new genericComponentClass(tag, props);
  }
  if (parentType === tag) {
    // Avoid recursion
    ("production" !== process.env.NODE_ENV ? invariant(
      genericComponentClass,
      'There is no registered component for the tag %s',
      tag
    ) : invariant(genericComponentClass));
    return new genericComponentClass(tag, props);
  }
  // Unwrap legacy factories
  return new componentClass.type(props);
}

var ReactNativeComponent = {
  createInstanceForTag: createInstanceForTag,
  injection: ReactNativeComponentInjection
};

module.exports = ReactNativeComponent;

}).call(this,require('_process'))
},{"./Object.assign":59,"./invariant":160,"_process":28}],100:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactOwner
 */

"use strict";

var emptyObject = require("./emptyObject");
var invariant = require("./invariant");

/**
 * ReactOwners are capable of storing references to owned components.
 *
 * All components are capable of //being// referenced by owner components, but
 * only ReactOwner components are capable of //referencing// owned components.
 * The named reference is known as a "ref".
 *
 * Refs are available when mounted and updated during reconciliation.
 *
 *   var MyComponent = React.createClass({
 *     render: function() {
 *       return (
 *         <div onClick={this.handleClick}>
 *           <CustomComponent ref="custom" />
 *         </div>
 *       );
 *     },
 *     handleClick: function() {
 *       this.refs.custom.handleClick();
 *     },
 *     componentDidMount: function() {
 *       this.refs.custom.initialize();
 *     }
 *   });
 *
 * Refs should rarely be used. When refs are used, they should only be done to
 * control data that is not handled by React's data flow.
 *
 * @class ReactOwner
 */
var ReactOwner = {

  /**
   * @param {?object} object
   * @return {boolean} True if `object` is a valid owner.
   * @final
   */
  isValidOwner: function(object) {
    return !!(
      object &&
      typeof object.attachRef === 'function' &&
      typeof object.detachRef === 'function'
    );
  },

  /**
   * Adds a component by ref to an owner component.
   *
   * @param {ReactComponent} component Component to reference.
   * @param {string} ref Name by which to refer to the component.
   * @param {ReactOwner} owner Component on which to record the ref.
   * @final
   * @internal
   */
  addComponentAsRefTo: function(component, ref, owner) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ReactOwner.isValidOwner(owner),
      'addComponentAsRefTo(...): Only a ReactOwner can have refs. This ' +
      'usually means that you\'re trying to add a ref to a component that ' +
      'doesn\'t have an owner (that is, was not created inside of another ' +
      'component\'s `render` method). Try rendering this component inside of ' +
      'a new top-level component which will hold the ref.'
    ) : invariant(ReactOwner.isValidOwner(owner)));
    owner.attachRef(ref, component);
  },

  /**
   * Removes a component by ref from an owner component.
   *
   * @param {ReactComponent} component Component to dereference.
   * @param {string} ref Name of the ref to remove.
   * @param {ReactOwner} owner Component on which the ref is recorded.
   * @final
   * @internal
   */
  removeComponentAsRefFrom: function(component, ref, owner) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ReactOwner.isValidOwner(owner),
      'removeComponentAsRefFrom(...): Only a ReactOwner can have refs. This ' +
      'usually means that you\'re trying to remove a ref to a component that ' +
      'doesn\'t have an owner (that is, was not created inside of another ' +
      'component\'s `render` method). Try rendering this component inside of ' +
      'a new top-level component which will hold the ref.'
    ) : invariant(ReactOwner.isValidOwner(owner)));
    // Check that `component` is still the current ref because we do not want to
    // detach the ref if another component stole it.
    if (owner.refs[ref] === component) {
      owner.detachRef(ref);
    }
  },

  /**
   * A ReactComponent must mix this in to have refs.
   *
   * @lends {ReactOwner.prototype}
   */
  Mixin: {

    construct: function() {
      this.refs = emptyObject;
    },

    /**
     * Lazily allocates the refs object and stores `component` as `ref`.
     *
     * @param {string} ref Reference name.
     * @param {component} component Component to store as `ref`.
     * @final
     * @private
     */
    attachRef: function(ref, component) {
      ("production" !== process.env.NODE_ENV ? invariant(
        component.isOwnedBy(this),
        'attachRef(%s, ...): Only a component\'s owner can store a ref to it.',
        ref
      ) : invariant(component.isOwnedBy(this)));
      var refs = this.refs === emptyObject ? (this.refs = {}) : this.refs;
      refs[ref] = component;
    },

    /**
     * Detaches a reference name.
     *
     * @param {string} ref Name to dereference.
     * @final
     * @private
     */
    detachRef: function(ref) {
      delete this.refs[ref];
    }

  }

};

module.exports = ReactOwner;

}).call(this,require('_process'))
},{"./emptyObject":142,"./invariant":160,"_process":28}],101:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPerf
 * @typechecks static-only
 */

"use strict";

/**
 * ReactPerf is a general AOP system designed to measure performance. This
 * module only has the hooks: see ReactDefaultPerf for the analysis tool.
 */
var ReactPerf = {
  /**
   * Boolean to enable/disable measurement. Set to false by default to prevent
   * accidental logging and perf loss.
   */
  enableMeasure: false,

  /**
   * Holds onto the measure function in use. By default, don't measure
   * anything, but we'll override this if we inject a measure function.
   */
  storedMeasure: _noMeasure,

  /**
   * Use this to wrap methods you want to measure. Zero overhead in production.
   *
   * @param {string} objName
   * @param {string} fnName
   * @param {function} func
   * @return {function}
   */
  measure: function(objName, fnName, func) {
    if ("production" !== process.env.NODE_ENV) {
      var measuredFunc = null;
      var wrapper = function() {
        if (ReactPerf.enableMeasure) {
          if (!measuredFunc) {
            measuredFunc = ReactPerf.storedMeasure(objName, fnName, func);
          }
          return measuredFunc.apply(this, arguments);
        }
        return func.apply(this, arguments);
      };
      wrapper.displayName = objName + '_' + fnName;
      return wrapper;
    }
    return func;
  },

  injection: {
    /**
     * @param {function} measure
     */
    injectMeasure: function(measure) {
      ReactPerf.storedMeasure = measure;
    }
  }
};

/**
 * Simply passes through the measured function, without measuring it.
 *
 * @param {string} objName
 * @param {string} fnName
 * @param {function} func
 * @return {function}
 */
function _noMeasure(objName, fnName, func) {
  return func;
}

module.exports = ReactPerf;

}).call(this,require('_process'))
},{"_process":28}],102:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTransferer
 */

"use strict";

var assign = require("./Object.assign");
var emptyFunction = require("./emptyFunction");
var invariant = require("./invariant");
var joinClasses = require("./joinClasses");
var warning = require("./warning");

var didWarn = false;

/**
 * Creates a transfer strategy that will merge prop values using the supplied
 * `mergeStrategy`. If a prop was previously unset, this just sets it.
 *
 * @param {function} mergeStrategy
 * @return {function}
 */
function createTransferStrategy(mergeStrategy) {
  return function(props, key, value) {
    if (!props.hasOwnProperty(key)) {
      props[key] = value;
    } else {
      props[key] = mergeStrategy(props[key], value);
    }
  };
}

var transferStrategyMerge = createTransferStrategy(function(a, b) {
  // `merge` overrides the first object's (`props[key]` above) keys using the
  // second object's (`value`) keys. An object's style's existing `propA` would
  // get overridden. Flip the order here.
  return assign({}, b, a);
});

/**
 * Transfer strategies dictate how props are transferred by `transferPropsTo`.
 * NOTE: if you add any more exceptions to this list you should be sure to
 * update `cloneWithProps()` accordingly.
 */
var TransferStrategies = {
  /**
   * Never transfer `children`.
   */
  children: emptyFunction,
  /**
   * Transfer the `className` prop by merging them.
   */
  className: createTransferStrategy(joinClasses),
  /**
   * Transfer the `style` prop (which is an object) by merging them.
   */
  style: transferStrategyMerge
};

/**
 * Mutates the first argument by transferring the properties from the second
 * argument.
 *
 * @param {object} props
 * @param {object} newProps
 * @return {object}
 */
function transferInto(props, newProps) {
  for (var thisKey in newProps) {
    if (!newProps.hasOwnProperty(thisKey)) {
      continue;
    }

    var transferStrategy = TransferStrategies[thisKey];

    if (transferStrategy && TransferStrategies.hasOwnProperty(thisKey)) {
      transferStrategy(props, thisKey, newProps[thisKey]);
    } else if (!props.hasOwnProperty(thisKey)) {
      props[thisKey] = newProps[thisKey];
    }
  }
  return props;
}

/**
 * ReactPropTransferer are capable of transferring props to another component
 * using a `transferPropsTo` method.
 *
 * @class ReactPropTransferer
 */
var ReactPropTransferer = {

  TransferStrategies: TransferStrategies,

  /**
   * Merge two props objects using TransferStrategies.
   *
   * @param {object} oldProps original props (they take precedence)
   * @param {object} newProps new props to merge in
   * @return {object} a new object containing both sets of props merged.
   */
  mergeProps: function(oldProps, newProps) {
    return transferInto(assign({}, oldProps), newProps);
  },

  /**
   * @lends {ReactPropTransferer.prototype}
   */
  Mixin: {

    /**
     * Transfer props from this component to a target component.
     *
     * Props that do not have an explicit transfer strategy will be transferred
     * only if the target component does not already have the prop set.
     *
     * This is usually used to pass down props to a returned root component.
     *
     * @param {ReactElement} element Component receiving the properties.
     * @return {ReactElement} The supplied `component`.
     * @final
     * @protected
     */
    transferPropsTo: function(element) {
      ("production" !== process.env.NODE_ENV ? invariant(
        element._owner === this,
        '%s: You can\'t call transferPropsTo() on a component that you ' +
        'don\'t own, %s. This usually means you are calling ' +
        'transferPropsTo() on a component passed in as props or children.',
        this.constructor.displayName,
        typeof element.type === 'string' ?
        element.type :
        element.type.displayName
      ) : invariant(element._owner === this));

      if ("production" !== process.env.NODE_ENV) {
        if (!didWarn) {
          didWarn = true;
          ("production" !== process.env.NODE_ENV ? warning(
            false,
            'transferPropsTo is deprecated. ' +
            'See http://fb.me/react-transferpropsto for more information.'
          ) : null);
        }
      }

      // Because elements are immutable we have to merge into the existing
      // props object rather than clone it.
      transferInto(element.props, this.props);

      return element;
    }

  }
};

module.exports = ReactPropTransferer;

}).call(this,require('_process'))
},{"./Object.assign":59,"./emptyFunction":141,"./invariant":160,"./joinClasses":165,"./warning":179,"_process":28}],103:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypeLocationNames
 */

"use strict";

var ReactPropTypeLocationNames = {};

if ("production" !== process.env.NODE_ENV) {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
}

module.exports = ReactPropTypeLocationNames;

}).call(this,require('_process'))
},{"_process":28}],104:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypeLocations
 */

"use strict";

var keyMirror = require("./keyMirror");

var ReactPropTypeLocations = keyMirror({
  prop: null,
  context: null,
  childContext: null
});

module.exports = ReactPropTypeLocations;

},{"./keyMirror":166}],105:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypes
 */

"use strict";

var ReactElement = require("./ReactElement");
var ReactPropTypeLocationNames = require("./ReactPropTypeLocationNames");

var deprecated = require("./deprecated");
var emptyFunction = require("./emptyFunction");

/**
 * Collection of methods that allow declaration and validation of props that are
 * supplied to React components. Example usage:
 *
 *   var Props = require('ReactPropTypes');
 *   var MyArticle = React.createClass({
 *     propTypes: {
 *       // An optional string prop named "description".
 *       description: Props.string,
 *
 *       // A required enum prop named "category".
 *       category: Props.oneOf(['News','Photos']).isRequired,
 *
 *       // A prop named "dialog" that requires an instance of Dialog.
 *       dialog: Props.instanceOf(Dialog).isRequired
 *     },
 *     render: function() { ... }
 *   });
 *
 * A more formal specification of how these methods are used:
 *
 *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
 *   decl := ReactPropTypes.{type}(.isRequired)?
 *
 * Each and every declaration produces a function with the same signature. This
 * allows the creation of custom validation functions. For example:
 *
 *  var MyLink = React.createClass({
 *    propTypes: {
 *      // An optional string or URI prop named "href".
 *      href: function(props, propName, componentName) {
 *        var propValue = props[propName];
 *        if (propValue != null && typeof propValue !== 'string' &&
 *            !(propValue instanceof URI)) {
 *          return new Error(
 *            'Expected a string or an URI for ' + propName + ' in ' +
 *            componentName
 *          );
 *        }
 *      }
 *    },
 *    render: function() {...}
 *  });
 *
 * @internal
 */

var ANONYMOUS = '<<anonymous>>';

var elementTypeChecker = createElementTypeChecker();
var nodeTypeChecker = createNodeChecker();

var ReactPropTypes = {
  array: createPrimitiveTypeChecker('array'),
  bool: createPrimitiveTypeChecker('boolean'),
  func: createPrimitiveTypeChecker('function'),
  number: createPrimitiveTypeChecker('number'),
  object: createPrimitiveTypeChecker('object'),
  string: createPrimitiveTypeChecker('string'),

  any: createAnyTypeChecker(),
  arrayOf: createArrayOfTypeChecker,
  element: elementTypeChecker,
  instanceOf: createInstanceTypeChecker,
  node: nodeTypeChecker,
  objectOf: createObjectOfTypeChecker,
  oneOf: createEnumTypeChecker,
  oneOfType: createUnionTypeChecker,
  shape: createShapeTypeChecker,

  component: deprecated(
    'React.PropTypes',
    'component',
    'element',
    this,
    elementTypeChecker
  ),
  renderable: deprecated(
    'React.PropTypes',
    'renderable',
    'node',
    this,
    nodeTypeChecker
  )
};

function createChainableTypeChecker(validate) {
  function checkType(isRequired, props, propName, componentName, location) {
    componentName = componentName || ANONYMOUS;
    if (props[propName] == null) {
      var locationName = ReactPropTypeLocationNames[location];
      if (isRequired) {
        return new Error(
          ("Required " + locationName + " `" + propName + "` was not specified in ")+
          ("`" + componentName + "`.")
        );
      }
    } else {
      return validate(props, propName, componentName, location);
    }
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}

function createPrimitiveTypeChecker(expectedType) {
  function validate(props, propName, componentName, location) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== expectedType) {
      var locationName = ReactPropTypeLocationNames[location];
      // `propValue` being instance of, say, date/regexp, pass the 'object'
      // check, but we can offer a more precise error message here rather than
      // 'of type `object`'.
      var preciseType = getPreciseType(propValue);

      return new Error(
        ("Invalid " + locationName + " `" + propName + "` of type `" + preciseType + "` ") +
        ("supplied to `" + componentName + "`, expected `" + expectedType + "`.")
      );
    }
  }
  return createChainableTypeChecker(validate);
}

function createAnyTypeChecker() {
  return createChainableTypeChecker(emptyFunction.thatReturns());
}

function createArrayOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location) {
    var propValue = props[propName];
    if (!Array.isArray(propValue)) {
      var locationName = ReactPropTypeLocationNames[location];
      var propType = getPropType(propValue);
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` of type ") +
        ("`" + propType + "` supplied to `" + componentName + "`, expected an array.")
      );
    }
    for (var i = 0; i < propValue.length; i++) {
      var error = typeChecker(propValue, i, componentName, location);
      if (error instanceof Error) {
        return error;
      }
    }
  }
  return createChainableTypeChecker(validate);
}

function createElementTypeChecker() {
  function validate(props, propName, componentName, location) {
    if (!ReactElement.isValidElement(props[propName])) {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` supplied to ") +
        ("`" + componentName + "`, expected a ReactElement.")
      );
    }
  }
  return createChainableTypeChecker(validate);
}

function createInstanceTypeChecker(expectedClass) {
  function validate(props, propName, componentName, location) {
    if (!(props[propName] instanceof expectedClass)) {
      var locationName = ReactPropTypeLocationNames[location];
      var expectedClassName = expectedClass.name || ANONYMOUS;
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` supplied to ") +
        ("`" + componentName + "`, expected instance of `" + expectedClassName + "`.")
      );
    }
  }
  return createChainableTypeChecker(validate);
}

function createEnumTypeChecker(expectedValues) {
  function validate(props, propName, componentName, location) {
    var propValue = props[propName];
    for (var i = 0; i < expectedValues.length; i++) {
      if (propValue === expectedValues[i]) {
        return;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    var valuesString = JSON.stringify(expectedValues);
    return new Error(
      ("Invalid " + locationName + " `" + propName + "` of value `" + propValue + "` ") +
      ("supplied to `" + componentName + "`, expected one of " + valuesString + ".")
    );
  }
  return createChainableTypeChecker(validate);
}

function createObjectOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` of type ") +
        ("`" + propType + "` supplied to `" + componentName + "`, expected an object.")
      );
    }
    for (var key in propValue) {
      if (propValue.hasOwnProperty(key)) {
        var error = typeChecker(propValue, key, componentName, location);
        if (error instanceof Error) {
          return error;
        }
      }
    }
  }
  return createChainableTypeChecker(validate);
}

function createUnionTypeChecker(arrayOfTypeCheckers) {
  function validate(props, propName, componentName, location) {
    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (checker(props, propName, componentName, location) == null) {
        return;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    return new Error(
      ("Invalid " + locationName + " `" + propName + "` supplied to ") +
      ("`" + componentName + "`.")
    );
  }
  return createChainableTypeChecker(validate);
}

function createNodeChecker() {
  function validate(props, propName, componentName, location) {
    if (!isNode(props[propName])) {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` supplied to ") +
        ("`" + componentName + "`, expected a ReactNode.")
      );
    }
  }
  return createChainableTypeChecker(validate);
}

function createShapeTypeChecker(shapeTypes) {
  function validate(props, propName, componentName, location) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new Error(
        ("Invalid " + locationName + " `" + propName + "` of type `" + propType + "` ") +
        ("supplied to `" + componentName + "`, expected `object`.")
      );
    }
    for (var key in shapeTypes) {
      var checker = shapeTypes[key];
      if (!checker) {
        continue;
      }
      var error = checker(propValue, key, componentName, location);
      if (error) {
        return error;
      }
    }
  }
  return createChainableTypeChecker(validate, 'expected `object`');
}

function isNode(propValue) {
  switch(typeof propValue) {
    case 'number':
    case 'string':
      return true;
    case 'boolean':
      return !propValue;
    case 'object':
      if (Array.isArray(propValue)) {
        return propValue.every(isNode);
      }
      if (ReactElement.isValidElement(propValue)) {
        return true;
      }
      for (var k in propValue) {
        if (!isNode(propValue[k])) {
          return false;
        }
      }
      return true;
    default:
      return false;
  }
}

// Equivalent of `typeof` but with special handling for array and regexp.
function getPropType(propValue) {
  var propType = typeof propValue;
  if (Array.isArray(propValue)) {
    return 'array';
  }
  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return 'object';
  }
  return propType;
}

// This handles more types than `getPropType`. Only used for error messages.
// See `createPrimitiveTypeChecker`.
function getPreciseType(propValue) {
  var propType = getPropType(propValue);
  if (propType === 'object') {
    if (propValue instanceof Date) {
      return 'date';
    } else if (propValue instanceof RegExp) {
      return 'regexp';
    }
  }
  return propType;
}

module.exports = ReactPropTypes;

},{"./ReactElement":85,"./ReactPropTypeLocationNames":103,"./deprecated":140,"./emptyFunction":141}],106:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPutListenerQueue
 */

"use strict";

var PooledClass = require("./PooledClass");
var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");

var assign = require("./Object.assign");

function ReactPutListenerQueue() {
  this.listenersToPut = [];
}

assign(ReactPutListenerQueue.prototype, {
  enqueuePutListener: function(rootNodeID, propKey, propValue) {
    this.listenersToPut.push({
      rootNodeID: rootNodeID,
      propKey: propKey,
      propValue: propValue
    });
  },

  putListeners: function() {
    for (var i = 0; i < this.listenersToPut.length; i++) {
      var listenerToPut = this.listenersToPut[i];
      ReactBrowserEventEmitter.putListener(
        listenerToPut.rootNodeID,
        listenerToPut.propKey,
        listenerToPut.propValue
      );
    }
  },

  reset: function() {
    this.listenersToPut.length = 0;
  },

  destructor: function() {
    this.reset();
  }
});

PooledClass.addPoolingTo(ReactPutListenerQueue);

module.exports = ReactPutListenerQueue;

},{"./Object.assign":59,"./PooledClass":60,"./ReactBrowserEventEmitter":63}],107:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactReconcileTransaction
 * @typechecks static-only
 */

"use strict";

var CallbackQueue = require("./CallbackQueue");
var PooledClass = require("./PooledClass");
var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
var ReactInputSelection = require("./ReactInputSelection");
var ReactPutListenerQueue = require("./ReactPutListenerQueue");
var Transaction = require("./Transaction");

var assign = require("./Object.assign");

/**
 * Ensures that, when possible, the selection range (currently selected text
 * input) is not disturbed by performing the transaction.
 */
var SELECTION_RESTORATION = {
  /**
   * @return {Selection} Selection information.
   */
  initialize: ReactInputSelection.getSelectionInformation,
  /**
   * @param {Selection} sel Selection information returned from `initialize`.
   */
  close: ReactInputSelection.restoreSelection
};

/**
 * Suppresses events (blur/focus) that could be inadvertently dispatched due to
 * high level DOM manipulations (like temporarily removing a text input from the
 * DOM).
 */
var EVENT_SUPPRESSION = {
  /**
   * @return {boolean} The enabled status of `ReactBrowserEventEmitter` before
   * the reconciliation.
   */
  initialize: function() {
    var currentlyEnabled = ReactBrowserEventEmitter.isEnabled();
    ReactBrowserEventEmitter.setEnabled(false);
    return currentlyEnabled;
  },

  /**
   * @param {boolean} previouslyEnabled Enabled status of
   *   `ReactBrowserEventEmitter` before the reconciliation occured. `close`
   *   restores the previous value.
   */
  close: function(previouslyEnabled) {
    ReactBrowserEventEmitter.setEnabled(previouslyEnabled);
  }
};

/**
 * Provides a queue for collecting `componentDidMount` and
 * `componentDidUpdate` callbacks during the the transaction.
 */
var ON_DOM_READY_QUEUEING = {
  /**
   * Initializes the internal `onDOMReady` queue.
   */
  initialize: function() {
    this.reactMountReady.reset();
  },

  /**
   * After DOM is flushed, invoke all registered `onDOMReady` callbacks.
   */
  close: function() {
    this.reactMountReady.notifyAll();
  }
};

var PUT_LISTENER_QUEUEING = {
  initialize: function() {
    this.putListenerQueue.reset();
  },

  close: function() {
    this.putListenerQueue.putListeners();
  }
};

/**
 * Executed within the scope of the `Transaction` instance. Consider these as
 * being member methods, but with an implied ordering while being isolated from
 * each other.
 */
var TRANSACTION_WRAPPERS = [
  PUT_LISTENER_QUEUEING,
  SELECTION_RESTORATION,
  EVENT_SUPPRESSION,
  ON_DOM_READY_QUEUEING
];

/**
 * Currently:
 * - The order that these are listed in the transaction is critical:
 * - Suppresses events.
 * - Restores selection range.
 *
 * Future:
 * - Restore document/overflow scroll positions that were unintentionally
 *   modified via DOM insertions above the top viewport boundary.
 * - Implement/integrate with customized constraint based layout system and keep
 *   track of which dimensions must be remeasured.
 *
 * @class ReactReconcileTransaction
 */
function ReactReconcileTransaction() {
  this.reinitializeTransaction();
  // Only server-side rendering really needs this option (see
  // `ReactServerRendering`), but server-side uses
  // `ReactServerRenderingTransaction` instead. This option is here so that it's
  // accessible and defaults to false when `ReactDOMComponent` and
  // `ReactTextComponent` checks it in `mountComponent`.`
  this.renderToStaticMarkup = false;
  this.reactMountReady = CallbackQueue.getPooled(null);
  this.putListenerQueue = ReactPutListenerQueue.getPooled();
}

var Mixin = {
  /**
   * @see Transaction
   * @abstract
   * @final
   * @return {array<object>} List of operation wrap proceedures.
   *   TODO: convert to array<TransactionWrapper>
   */
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  },

  /**
   * @return {object} The queue to collect `onDOMReady` callbacks with.
   */
  getReactMountReady: function() {
    return this.reactMountReady;
  },

  getPutListenerQueue: function() {
    return this.putListenerQueue;
  },

  /**
   * `PooledClass` looks for this, and will invoke this before allowing this
   * instance to be resused.
   */
  destructor: function() {
    CallbackQueue.release(this.reactMountReady);
    this.reactMountReady = null;

    ReactPutListenerQueue.release(this.putListenerQueue);
    this.putListenerQueue = null;
  }
};


assign(ReactReconcileTransaction.prototype, Transaction.Mixin, Mixin);

PooledClass.addPoolingTo(ReactReconcileTransaction);

module.exports = ReactReconcileTransaction;

},{"./CallbackQueue":38,"./Object.assign":59,"./PooledClass":60,"./ReactBrowserEventEmitter":63,"./ReactInputSelection":92,"./ReactPutListenerQueue":106,"./Transaction":128}],108:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactRootIndex
 * @typechecks
 */

"use strict";

var ReactRootIndexInjection = {
  /**
   * @param {function} _createReactRootIndex
   */
  injectCreateReactRootIndex: function(_createReactRootIndex) {
    ReactRootIndex.createReactRootIndex = _createReactRootIndex;
  }
};

var ReactRootIndex = {
  createReactRootIndex: null,
  injection: ReactRootIndexInjection
};

module.exports = ReactRootIndex;

},{}],109:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks static-only
 * @providesModule ReactServerRendering
 */
"use strict";

var ReactElement = require("./ReactElement");
var ReactInstanceHandles = require("./ReactInstanceHandles");
var ReactMarkupChecksum = require("./ReactMarkupChecksum");
var ReactServerRenderingTransaction =
  require("./ReactServerRenderingTransaction");

var instantiateReactComponent = require("./instantiateReactComponent");
var invariant = require("./invariant");

/**
 * @param {ReactElement} element
 * @return {string} the HTML markup
 */
function renderToString(element) {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactElement.isValidElement(element),
    'renderToString(): You must pass a valid ReactElement.'
  ) : invariant(ReactElement.isValidElement(element)));

  var transaction;
  try {
    var id = ReactInstanceHandles.createReactRootID();
    transaction = ReactServerRenderingTransaction.getPooled(false);

    return transaction.perform(function() {
      var componentInstance = instantiateReactComponent(element, null);
      var markup = componentInstance.mountComponent(id, transaction, 0);
      return ReactMarkupChecksum.addChecksumToMarkup(markup);
    }, null);
  } finally {
    ReactServerRenderingTransaction.release(transaction);
  }
}

/**
 * @param {ReactElement} element
 * @return {string} the HTML markup, without the extra React ID and checksum
 * (for generating static pages)
 */
function renderToStaticMarkup(element) {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactElement.isValidElement(element),
    'renderToStaticMarkup(): You must pass a valid ReactElement.'
  ) : invariant(ReactElement.isValidElement(element)));

  var transaction;
  try {
    var id = ReactInstanceHandles.createReactRootID();
    transaction = ReactServerRenderingTransaction.getPooled(true);

    return transaction.perform(function() {
      var componentInstance = instantiateReactComponent(element, null);
      return componentInstance.mountComponent(id, transaction, 0);
    }, null);
  } finally {
    ReactServerRenderingTransaction.release(transaction);
  }
}

module.exports = {
  renderToString: renderToString,
  renderToStaticMarkup: renderToStaticMarkup
};

}).call(this,require('_process'))
},{"./ReactElement":85,"./ReactInstanceHandles":93,"./ReactMarkupChecksum":95,"./ReactServerRenderingTransaction":110,"./instantiateReactComponent":159,"./invariant":160,"_process":28}],110:[function(require,module,exports){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactServerRenderingTransaction
 * @typechecks
 */

"use strict";

var PooledClass = require("./PooledClass");
var CallbackQueue = require("./CallbackQueue");
var ReactPutListenerQueue = require("./ReactPutListenerQueue");
var Transaction = require("./Transaction");

var assign = require("./Object.assign");
var emptyFunction = require("./emptyFunction");

/**
 * Provides a `CallbackQueue` queue for collecting `onDOMReady` callbacks
 * during the performing of the transaction.
 */
var ON_DOM_READY_QUEUEING = {
  /**
   * Initializes the internal `onDOMReady` queue.
   */
  initialize: function() {
    this.reactMountReady.reset();
  },

  close: emptyFunction
};

var PUT_LISTENER_QUEUEING = {
  initialize: function() {
    this.putListenerQueue.reset();
  },

  close: emptyFunction
};

/**
 * Executed within the scope of the `Transaction` instance. Consider these as
 * being member methods, but with an implied ordering while being isolated from
 * each other.
 */
var TRANSACTION_WRAPPERS = [
  PUT_LISTENER_QUEUEING,
  ON_DOM_READY_QUEUEING
];

/**
 * @class ReactServerRenderingTransaction
 * @param {boolean} renderToStaticMarkup
 */
function ReactServerRenderingTransaction(renderToStaticMarkup) {
  this.reinitializeTransaction();
  this.renderToStaticMarkup = renderToStaticMarkup;
  this.reactMountReady = CallbackQueue.getPooled(null);
  this.putListenerQueue = ReactPutListenerQueue.getPooled();
}

var Mixin = {
  /**
   * @see Transaction
   * @abstract
   * @final
   * @return {array} Empty list of operation wrap proceedures.
   */
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  },

  /**
   * @return {object} The queue to collect `onDOMReady` callbacks with.
   */
  getReactMountReady: function() {
    return this.reactMountReady;
  },

  getPutListenerQueue: function() {
    return this.putListenerQueue;
  },

  /**
   * `PooledClass` looks for this, and will invoke this before allowing this
   * instance to be resused.
   */
  destructor: function() {
    CallbackQueue.release(this.reactMountReady);
    this.reactMountReady = null;

    ReactPutListenerQueue.release(this.putListenerQueue);
    this.putListenerQueue = null;
  }
};


assign(
  ReactServerRenderingTransaction.prototype,
  Transaction.Mixin,
  Mixin
);

PooledClass.addPoolingTo(ReactServerRenderingTransaction);

module.exports = ReactServerRenderingTransaction;

},{"./CallbackQueue":38,"./Object.assign":59,"./PooledClass":60,"./ReactPutListenerQueue":106,"./Transaction":128,"./emptyFunction":141}],111:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactTextComponent
 * @typechecks static-only
 */

"use strict";

var DOMPropertyOperations = require("./DOMPropertyOperations");
var ReactComponent = require("./ReactComponent");
var ReactElement = require("./ReactElement");

var assign = require("./Object.assign");
var escapeTextForBrowser = require("./escapeTextForBrowser");

/**
 * Text nodes violate a couple assumptions that React makes about components:
 *
 *  - When mounting text into the DOM, adjacent text nodes are merged.
 *  - Text nodes cannot be assigned a React root ID.
 *
 * This component is used to wrap strings in elements so that they can undergo
 * the same reconciliation that is applied to elements.
 *
 * TODO: Investigate representing React components in the DOM with text nodes.
 *
 * @class ReactTextComponent
 * @extends ReactComponent
 * @internal
 */
var ReactTextComponent = function(props) {
  // This constructor and it's argument is currently used by mocks.
};

assign(ReactTextComponent.prototype, ReactComponent.Mixin, {

  /**
   * Creates the markup for this text node. This node is not intended to have
   * any features besides containing text content.
   *
   * @param {string} rootID DOM ID of the root node.
   * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
   * @param {number} mountDepth number of components in the owner hierarchy
   * @return {string} Markup for this text node.
   * @internal
   */
  mountComponent: function(rootID, transaction, mountDepth) {
    ReactComponent.Mixin.mountComponent.call(
      this,
      rootID,
      transaction,
      mountDepth
    );

    var escapedText = escapeTextForBrowser(this.props);

    if (transaction.renderToStaticMarkup) {
      // Normally we'd wrap this in a `span` for the reasons stated above, but
      // since this is a situation where React won't take over (static pages),
      // we can simply return the text as it is.
      return escapedText;
    }

    return (
      '<span ' + DOMPropertyOperations.createMarkupForID(rootID) + '>' +
        escapedText +
      '</span>'
    );
  },

  /**
   * Updates this component by updating the text content.
   *
   * @param {object} nextComponent Contains the next text content.
   * @param {ReactReconcileTransaction} transaction
   * @internal
   */
  receiveComponent: function(nextComponent, transaction) {
    var nextProps = nextComponent.props;
    if (nextProps !== this.props) {
      this.props = nextProps;
      ReactComponent.BackendIDOperations.updateTextContentByID(
        this._rootNodeID,
        nextProps
      );
    }
  }

});

var ReactTextComponentFactory = function(text) {
  // Bypass validation and configuration
  return new ReactElement(ReactTextComponent, null, null, null, null, text);
};

ReactTextComponentFactory.type = ReactTextComponent;

module.exports = ReactTextComponentFactory;

},{"./DOMPropertyOperations":44,"./Object.assign":59,"./ReactComponent":65,"./ReactElement":85,"./escapeTextForBrowser":143}],112:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactUpdates
 */

"use strict";

var CallbackQueue = require("./CallbackQueue");
var PooledClass = require("./PooledClass");
var ReactCurrentOwner = require("./ReactCurrentOwner");
var ReactPerf = require("./ReactPerf");
var Transaction = require("./Transaction");

var assign = require("./Object.assign");
var invariant = require("./invariant");
var warning = require("./warning");

var dirtyComponents = [];
var asapCallbackQueue = CallbackQueue.getPooled();
var asapEnqueued = false;

var batchingStrategy = null;

function ensureInjected() {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactUpdates.ReactReconcileTransaction && batchingStrategy,
    'ReactUpdates: must inject a reconcile transaction class and batching ' +
    'strategy'
  ) : invariant(ReactUpdates.ReactReconcileTransaction && batchingStrategy));
}

var NESTED_UPDATES = {
  initialize: function() {
    this.dirtyComponentsLength = dirtyComponents.length;
  },
  close: function() {
    if (this.dirtyComponentsLength !== dirtyComponents.length) {
      // Additional updates were enqueued by componentDidUpdate handlers or
      // similar; before our own UPDATE_QUEUEING wrapper closes, we want to run
      // these new updates so that if A's componentDidUpdate calls setState on
      // B, B will update before the callback A's updater provided when calling
      // setState.
      dirtyComponents.splice(0, this.dirtyComponentsLength);
      flushBatchedUpdates();
    } else {
      dirtyComponents.length = 0;
    }
  }
};

var UPDATE_QUEUEING = {
  initialize: function() {
    this.callbackQueue.reset();
  },
  close: function() {
    this.callbackQueue.notifyAll();
  }
};

var TRANSACTION_WRAPPERS = [NESTED_UPDATES, UPDATE_QUEUEING];

function ReactUpdatesFlushTransaction() {
  this.reinitializeTransaction();
  this.dirtyComponentsLength = null;
  this.callbackQueue = CallbackQueue.getPooled();
  this.reconcileTransaction =
    ReactUpdates.ReactReconcileTransaction.getPooled();
}

assign(
  ReactUpdatesFlushTransaction.prototype,
  Transaction.Mixin, {
  getTransactionWrappers: function() {
    return TRANSACTION_WRAPPERS;
  },

  destructor: function() {
    this.dirtyComponentsLength = null;
    CallbackQueue.release(this.callbackQueue);
    this.callbackQueue = null;
    ReactUpdates.ReactReconcileTransaction.release(this.reconcileTransaction);
    this.reconcileTransaction = null;
  },

  perform: function(method, scope, a) {
    // Essentially calls `this.reconcileTransaction.perform(method, scope, a)`
    // with this transaction's wrappers around it.
    return Transaction.Mixin.perform.call(
      this,
      this.reconcileTransaction.perform,
      this.reconcileTransaction,
      method,
      scope,
      a
    );
  }
});

PooledClass.addPoolingTo(ReactUpdatesFlushTransaction);

function batchedUpdates(callback, a, b) {
  ensureInjected();
  batchingStrategy.batchedUpdates(callback, a, b);
}

/**
 * Array comparator for ReactComponents by owner depth
 *
 * @param {ReactComponent} c1 first component you're comparing
 * @param {ReactComponent} c2 second component you're comparing
 * @return {number} Return value usable by Array.prototype.sort().
 */
function mountDepthComparator(c1, c2) {
  return c1._mountDepth - c2._mountDepth;
}

function runBatchedUpdates(transaction) {
  var len = transaction.dirtyComponentsLength;
  ("production" !== process.env.NODE_ENV ? invariant(
    len === dirtyComponents.length,
    'Expected flush transaction\'s stored dirty-components length (%s) to ' +
    'match dirty-components array length (%s).',
    len,
    dirtyComponents.length
  ) : invariant(len === dirtyComponents.length));

  // Since reconciling a component higher in the owner hierarchy usually (not
  // always -- see shouldComponentUpdate()) will reconcile children, reconcile
  // them before their children by sorting the array.
  dirtyComponents.sort(mountDepthComparator);

  for (var i = 0; i < len; i++) {
    // If a component is unmounted before pending changes apply, ignore them
    // TODO: Queue unmounts in the same list to avoid this happening at all
    var component = dirtyComponents[i];
    if (component.isMounted()) {
      // If performUpdateIfNecessary happens to enqueue any new updates, we
      // shouldn't execute the callbacks until the next render happens, so
      // stash the callbacks first
      var callbacks = component._pendingCallbacks;
      component._pendingCallbacks = null;
      component.performUpdateIfNecessary(transaction.reconcileTransaction);

      if (callbacks) {
        for (var j = 0; j < callbacks.length; j++) {
          transaction.callbackQueue.enqueue(
            callbacks[j],
            component
          );
        }
      }
    }
  }
}

var flushBatchedUpdates = ReactPerf.measure(
  'ReactUpdates',
  'flushBatchedUpdates',
  function() {
    // ReactUpdatesFlushTransaction's wrappers will clear the dirtyComponents
    // array and perform any updates enqueued by mount-ready handlers (i.e.,
    // componentDidUpdate) but we need to check here too in order to catch
    // updates enqueued by setState callbacks and asap calls.
    while (dirtyComponents.length || asapEnqueued) {
      if (dirtyComponents.length) {
        var transaction = ReactUpdatesFlushTransaction.getPooled();
        transaction.perform(runBatchedUpdates, null, transaction);
        ReactUpdatesFlushTransaction.release(transaction);
      }

      if (asapEnqueued) {
        asapEnqueued = false;
        var queue = asapCallbackQueue;
        asapCallbackQueue = CallbackQueue.getPooled();
        queue.notifyAll();
        CallbackQueue.release(queue);
      }
    }
  }
);

/**
 * Mark a component as needing a rerender, adding an optional callback to a
 * list of functions which will be executed once the rerender occurs.
 */
function enqueueUpdate(component, callback) {
  ("production" !== process.env.NODE_ENV ? invariant(
    !callback || typeof callback === "function",
    'enqueueUpdate(...): You called `setProps`, `replaceProps`, ' +
    '`setState`, `replaceState`, or `forceUpdate` with a callback that ' +
    'isn\'t callable.'
  ) : invariant(!callback || typeof callback === "function"));
  ensureInjected();

  // Various parts of our code (such as ReactCompositeComponent's
  // _renderValidatedComponent) assume that calls to render aren't nested;
  // verify that that's the case. (This is called by each top-level update
  // function, like setProps, setState, forceUpdate, etc.; creation and
  // destruction of top-level components is guarded in ReactMount.)
  ("production" !== process.env.NODE_ENV ? warning(
    ReactCurrentOwner.current == null,
    'enqueueUpdate(): Render methods should be a pure function of props ' +
    'and state; triggering nested component updates from render is not ' +
    'allowed. If necessary, trigger nested updates in ' +
    'componentDidUpdate.'
  ) : null);

  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component, callback);
    return;
  }

  dirtyComponents.push(component);

  if (callback) {
    if (component._pendingCallbacks) {
      component._pendingCallbacks.push(callback);
    } else {
      component._pendingCallbacks = [callback];
    }
  }
}

/**
 * Enqueue a callback to be run at the end of the current batching cycle. Throws
 * if no updates are currently being performed.
 */
function asap(callback, context) {
  ("production" !== process.env.NODE_ENV ? invariant(
    batchingStrategy.isBatchingUpdates,
    'ReactUpdates.asap: Can\'t enqueue an asap callback in a context where' +
    'updates are not being batched.'
  ) : invariant(batchingStrategy.isBatchingUpdates));
  asapCallbackQueue.enqueue(callback, context);
  asapEnqueued = true;
}

var ReactUpdatesInjection = {
  injectReconcileTransaction: function(ReconcileTransaction) {
    ("production" !== process.env.NODE_ENV ? invariant(
      ReconcileTransaction,
      'ReactUpdates: must provide a reconcile transaction class'
    ) : invariant(ReconcileTransaction));
    ReactUpdates.ReactReconcileTransaction = ReconcileTransaction;
  },

  injectBatchingStrategy: function(_batchingStrategy) {
    ("production" !== process.env.NODE_ENV ? invariant(
      _batchingStrategy,
      'ReactUpdates: must provide a batching strategy'
    ) : invariant(_batchingStrategy));
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof _batchingStrategy.batchedUpdates === 'function',
      'ReactUpdates: must provide a batchedUpdates() function'
    ) : invariant(typeof _batchingStrategy.batchedUpdates === 'function'));
    ("production" !== process.env.NODE_ENV ? invariant(
      typeof _batchingStrategy.isBatchingUpdates === 'boolean',
      'ReactUpdates: must provide an isBatchingUpdates boolean attribute'
    ) : invariant(typeof _batchingStrategy.isBatchingUpdates === 'boolean'));
    batchingStrategy = _batchingStrategy;
  }
};

var ReactUpdates = {
  /**
   * React references `ReactReconcileTransaction` using this property in order
   * to allow dependency injection.
   *
   * @internal
   */
  ReactReconcileTransaction: null,

  batchedUpdates: batchedUpdates,
  enqueueUpdate: enqueueUpdate,
  flushBatchedUpdates: flushBatchedUpdates,
  injection: ReactUpdatesInjection,
  asap: asap
};

module.exports = ReactUpdates;

}).call(this,require('_process'))
},{"./CallbackQueue":38,"./Object.assign":59,"./PooledClass":60,"./ReactCurrentOwner":69,"./ReactPerf":101,"./Transaction":128,"./invariant":160,"./warning":179,"_process":28}],113:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SVGDOMPropertyConfig
 */

/*jslint bitwise: true*/

"use strict";

var DOMProperty = require("./DOMProperty");

var MUST_USE_ATTRIBUTE = DOMProperty.injection.MUST_USE_ATTRIBUTE;

var SVGDOMPropertyConfig = {
  Properties: {
    cx: MUST_USE_ATTRIBUTE,
    cy: MUST_USE_ATTRIBUTE,
    d: MUST_USE_ATTRIBUTE,
    dx: MUST_USE_ATTRIBUTE,
    dy: MUST_USE_ATTRIBUTE,
    fill: MUST_USE_ATTRIBUTE,
    fillOpacity: MUST_USE_ATTRIBUTE,
    fontFamily: MUST_USE_ATTRIBUTE,
    fontSize: MUST_USE_ATTRIBUTE,
    fx: MUST_USE_ATTRIBUTE,
    fy: MUST_USE_ATTRIBUTE,
    gradientTransform: MUST_USE_ATTRIBUTE,
    gradientUnits: MUST_USE_ATTRIBUTE,
    markerEnd: MUST_USE_ATTRIBUTE,
    markerMid: MUST_USE_ATTRIBUTE,
    markerStart: MUST_USE_ATTRIBUTE,
    offset: MUST_USE_ATTRIBUTE,
    opacity: MUST_USE_ATTRIBUTE,
    patternContentUnits: MUST_USE_ATTRIBUTE,
    patternUnits: MUST_USE_ATTRIBUTE,
    points: MUST_USE_ATTRIBUTE,
    preserveAspectRatio: MUST_USE_ATTRIBUTE,
    r: MUST_USE_ATTRIBUTE,
    rx: MUST_USE_ATTRIBUTE,
    ry: MUST_USE_ATTRIBUTE,
    spreadMethod: MUST_USE_ATTRIBUTE,
    stopColor: MUST_USE_ATTRIBUTE,
    stopOpacity: MUST_USE_ATTRIBUTE,
    stroke: MUST_USE_ATTRIBUTE,
    strokeDasharray: MUST_USE_ATTRIBUTE,
    strokeLinecap: MUST_USE_ATTRIBUTE,
    strokeOpacity: MUST_USE_ATTRIBUTE,
    strokeWidth: MUST_USE_ATTRIBUTE,
    textAnchor: MUST_USE_ATTRIBUTE,
    transform: MUST_USE_ATTRIBUTE,
    version: MUST_USE_ATTRIBUTE,
    viewBox: MUST_USE_ATTRIBUTE,
    x1: MUST_USE_ATTRIBUTE,
    x2: MUST_USE_ATTRIBUTE,
    x: MUST_USE_ATTRIBUTE,
    y1: MUST_USE_ATTRIBUTE,
    y2: MUST_USE_ATTRIBUTE,
    y: MUST_USE_ATTRIBUTE
  },
  DOMAttributeNames: {
    fillOpacity: 'fill-opacity',
    fontFamily: 'font-family',
    fontSize: 'font-size',
    gradientTransform: 'gradientTransform',
    gradientUnits: 'gradientUnits',
    markerEnd: 'marker-end',
    markerMid: 'marker-mid',
    markerStart: 'marker-start',
    patternContentUnits: 'patternContentUnits',
    patternUnits: 'patternUnits',
    preserveAspectRatio: 'preserveAspectRatio',
    spreadMethod: 'spreadMethod',
    stopColor: 'stop-color',
    stopOpacity: 'stop-opacity',
    strokeDasharray: 'stroke-dasharray',
    strokeLinecap: 'stroke-linecap',
    strokeOpacity: 'stroke-opacity',
    strokeWidth: 'stroke-width',
    textAnchor: 'text-anchor',
    viewBox: 'viewBox'
  }
};

module.exports = SVGDOMPropertyConfig;

},{"./DOMProperty":43}],114:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SelectEventPlugin
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPropagators = require("./EventPropagators");
var ReactInputSelection = require("./ReactInputSelection");
var SyntheticEvent = require("./SyntheticEvent");

var getActiveElement = require("./getActiveElement");
var isTextInputElement = require("./isTextInputElement");
var keyOf = require("./keyOf");
var shallowEqual = require("./shallowEqual");

var topLevelTypes = EventConstants.topLevelTypes;

var eventTypes = {
  select: {
    phasedRegistrationNames: {
      bubbled: keyOf({onSelect: null}),
      captured: keyOf({onSelectCapture: null})
    },
    dependencies: [
      topLevelTypes.topBlur,
      topLevelTypes.topContextMenu,
      topLevelTypes.topFocus,
      topLevelTypes.topKeyDown,
      topLevelTypes.topMouseDown,
      topLevelTypes.topMouseUp,
      topLevelTypes.topSelectionChange
    ]
  }
};

var activeElement = null;
var activeElementID = null;
var lastSelection = null;
var mouseDown = false;

/**
 * Get an object which is a unique representation of the current selection.
 *
 * The return value will not be consistent across nodes or browsers, but
 * two identical selections on the same node will return identical objects.
 *
 * @param {DOMElement} node
 * @param {object}
 */
function getSelection(node) {
  if ('selectionStart' in node &&
      ReactInputSelection.hasSelectionCapabilities(node)) {
    return {
      start: node.selectionStart,
      end: node.selectionEnd
    };
  } else if (window.getSelection) {
    var selection = window.getSelection();
    return {
      anchorNode: selection.anchorNode,
      anchorOffset: selection.anchorOffset,
      focusNode: selection.focusNode,
      focusOffset: selection.focusOffset
    };
  } else if (document.selection) {
    var range = document.selection.createRange();
    return {
      parentElement: range.parentElement(),
      text: range.text,
      top: range.boundingTop,
      left: range.boundingLeft
    };
  }
}

/**
 * Poll selection to see whether it's changed.
 *
 * @param {object} nativeEvent
 * @return {?SyntheticEvent}
 */
function constructSelectEvent(nativeEvent) {
  // Ensure we have the right element, and that the user is not dragging a
  // selection (this matches native `select` event behavior). In HTML5, select
  // fires only on input and textarea thus if there's no focused element we
  // won't dispatch.
  if (mouseDown ||
      activeElement == null ||
      activeElement != getActiveElement()) {
    return;
  }

  // Only fire when selection has actually changed.
  var currentSelection = getSelection(activeElement);
  if (!lastSelection || !shallowEqual(lastSelection, currentSelection)) {
    lastSelection = currentSelection;

    var syntheticEvent = SyntheticEvent.getPooled(
      eventTypes.select,
      activeElementID,
      nativeEvent
    );

    syntheticEvent.type = 'select';
    syntheticEvent.target = activeElement;

    EventPropagators.accumulateTwoPhaseDispatches(syntheticEvent);

    return syntheticEvent;
  }
}

/**
 * This plugin creates an `onSelect` event that normalizes select events
 * across form elements.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - contentEditable
 *
 * This differs from native browser implementations in the following ways:
 * - Fires on contentEditable fields as well as inputs.
 * - Fires for collapsed selection.
 * - Fires after user input.
 */
var SelectEventPlugin = {

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {

    switch (topLevelType) {
      // Track the input node that has focus.
      case topLevelTypes.topFocus:
        if (isTextInputElement(topLevelTarget) ||
            topLevelTarget.contentEditable === 'true') {
          activeElement = topLevelTarget;
          activeElementID = topLevelTargetID;
          lastSelection = null;
        }
        break;
      case topLevelTypes.topBlur:
        activeElement = null;
        activeElementID = null;
        lastSelection = null;
        break;

      // Don't fire the event while the user is dragging. This matches the
      // semantics of the native select event.
      case topLevelTypes.topMouseDown:
        mouseDown = true;
        break;
      case topLevelTypes.topContextMenu:
      case topLevelTypes.topMouseUp:
        mouseDown = false;
        return constructSelectEvent(nativeEvent);

      // Chrome and IE fire non-standard event when selection is changed (and
      // sometimes when it hasn't).
      // Firefox doesn't support selectionchange, so check selection status
      // after each key entry. The selection changes after keydown and before
      // keyup, but we check on keydown as well in the case of holding down a
      // key, when multiple keydown events are fired but only one keyup is.
      case topLevelTypes.topSelectionChange:
      case topLevelTypes.topKeyDown:
      case topLevelTypes.topKeyUp:
        return constructSelectEvent(nativeEvent);
    }
  }
};

module.exports = SelectEventPlugin;

},{"./EventConstants":48,"./EventPropagators":53,"./ReactInputSelection":92,"./SyntheticEvent":120,"./getActiveElement":147,"./isTextInputElement":163,"./keyOf":167,"./shallowEqual":175}],115:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ServerReactRootIndex
 * @typechecks
 */

"use strict";

/**
 * Size of the reactRoot ID space. We generate random numbers for React root
 * IDs and if there's a collision the events and DOM update system will
 * get confused. In the future we need a way to generate GUIDs but for
 * now this will work on a smaller scale.
 */
var GLOBAL_MOUNT_POINT_MAX = Math.pow(2, 53);

var ServerReactRootIndex = {
  createReactRootIndex: function() {
    return Math.ceil(Math.random() * GLOBAL_MOUNT_POINT_MAX);
  }
};

module.exports = ServerReactRootIndex;

},{}],116:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SimpleEventPlugin
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPluginUtils = require("./EventPluginUtils");
var EventPropagators = require("./EventPropagators");
var SyntheticClipboardEvent = require("./SyntheticClipboardEvent");
var SyntheticEvent = require("./SyntheticEvent");
var SyntheticFocusEvent = require("./SyntheticFocusEvent");
var SyntheticKeyboardEvent = require("./SyntheticKeyboardEvent");
var SyntheticMouseEvent = require("./SyntheticMouseEvent");
var SyntheticDragEvent = require("./SyntheticDragEvent");
var SyntheticTouchEvent = require("./SyntheticTouchEvent");
var SyntheticUIEvent = require("./SyntheticUIEvent");
var SyntheticWheelEvent = require("./SyntheticWheelEvent");

var getEventCharCode = require("./getEventCharCode");

var invariant = require("./invariant");
var keyOf = require("./keyOf");
var warning = require("./warning");

var topLevelTypes = EventConstants.topLevelTypes;

var eventTypes = {
  blur: {
    phasedRegistrationNames: {
      bubbled: keyOf({onBlur: true}),
      captured: keyOf({onBlurCapture: true})
    }
  },
  click: {
    phasedRegistrationNames: {
      bubbled: keyOf({onClick: true}),
      captured: keyOf({onClickCapture: true})
    }
  },
  contextMenu: {
    phasedRegistrationNames: {
      bubbled: keyOf({onContextMenu: true}),
      captured: keyOf({onContextMenuCapture: true})
    }
  },
  copy: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCopy: true}),
      captured: keyOf({onCopyCapture: true})
    }
  },
  cut: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCut: true}),
      captured: keyOf({onCutCapture: true})
    }
  },
  doubleClick: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDoubleClick: true}),
      captured: keyOf({onDoubleClickCapture: true})
    }
  },
  drag: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDrag: true}),
      captured: keyOf({onDragCapture: true})
    }
  },
  dragEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragEnd: true}),
      captured: keyOf({onDragEndCapture: true})
    }
  },
  dragEnter: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragEnter: true}),
      captured: keyOf({onDragEnterCapture: true})
    }
  },
  dragExit: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragExit: true}),
      captured: keyOf({onDragExitCapture: true})
    }
  },
  dragLeave: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragLeave: true}),
      captured: keyOf({onDragLeaveCapture: true})
    }
  },
  dragOver: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragOver: true}),
      captured: keyOf({onDragOverCapture: true})
    }
  },
  dragStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragStart: true}),
      captured: keyOf({onDragStartCapture: true})
    }
  },
  drop: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDrop: true}),
      captured: keyOf({onDropCapture: true})
    }
  },
  focus: {
    phasedRegistrationNames: {
      bubbled: keyOf({onFocus: true}),
      captured: keyOf({onFocusCapture: true})
    }
  },
  input: {
    phasedRegistrationNames: {
      bubbled: keyOf({onInput: true}),
      captured: keyOf({onInputCapture: true})
    }
  },
  keyDown: {
    phasedRegistrationNames: {
      bubbled: keyOf({onKeyDown: true}),
      captured: keyOf({onKeyDownCapture: true})
    }
  },
  keyPress: {
    phasedRegistrationNames: {
      bubbled: keyOf({onKeyPress: true}),
      captured: keyOf({onKeyPressCapture: true})
    }
  },
  keyUp: {
    phasedRegistrationNames: {
      bubbled: keyOf({onKeyUp: true}),
      captured: keyOf({onKeyUpCapture: true})
    }
  },
  load: {
    phasedRegistrationNames: {
      bubbled: keyOf({onLoad: true}),
      captured: keyOf({onLoadCapture: true})
    }
  },
  error: {
    phasedRegistrationNames: {
      bubbled: keyOf({onError: true}),
      captured: keyOf({onErrorCapture: true})
    }
  },
  // Note: We do not allow listening to mouseOver events. Instead, use the
  // onMouseEnter/onMouseLeave created by `EnterLeaveEventPlugin`.
  mouseDown: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseDown: true}),
      captured: keyOf({onMouseDownCapture: true})
    }
  },
  mouseMove: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseMove: true}),
      captured: keyOf({onMouseMoveCapture: true})
    }
  },
  mouseOut: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseOut: true}),
      captured: keyOf({onMouseOutCapture: true})
    }
  },
  mouseOver: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseOver: true}),
      captured: keyOf({onMouseOverCapture: true})
    }
  },
  mouseUp: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseUp: true}),
      captured: keyOf({onMouseUpCapture: true})
    }
  },
  paste: {
    phasedRegistrationNames: {
      bubbled: keyOf({onPaste: true}),
      captured: keyOf({onPasteCapture: true})
    }
  },
  reset: {
    phasedRegistrationNames: {
      bubbled: keyOf({onReset: true}),
      captured: keyOf({onResetCapture: true})
    }
  },
  scroll: {
    phasedRegistrationNames: {
      bubbled: keyOf({onScroll: true}),
      captured: keyOf({onScrollCapture: true})
    }
  },
  submit: {
    phasedRegistrationNames: {
      bubbled: keyOf({onSubmit: true}),
      captured: keyOf({onSubmitCapture: true})
    }
  },
  touchCancel: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchCancel: true}),
      captured: keyOf({onTouchCancelCapture: true})
    }
  },
  touchEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchEnd: true}),
      captured: keyOf({onTouchEndCapture: true})
    }
  },
  touchMove: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchMove: true}),
      captured: keyOf({onTouchMoveCapture: true})
    }
  },
  touchStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchStart: true}),
      captured: keyOf({onTouchStartCapture: true})
    }
  },
  wheel: {
    phasedRegistrationNames: {
      bubbled: keyOf({onWheel: true}),
      captured: keyOf({onWheelCapture: true})
    }
  }
};

var topLevelEventsToDispatchConfig = {
  topBlur:        eventTypes.blur,
  topClick:       eventTypes.click,
  topContextMenu: eventTypes.contextMenu,
  topCopy:        eventTypes.copy,
  topCut:         eventTypes.cut,
  topDoubleClick: eventTypes.doubleClick,
  topDrag:        eventTypes.drag,
  topDragEnd:     eventTypes.dragEnd,
  topDragEnter:   eventTypes.dragEnter,
  topDragExit:    eventTypes.dragExit,
  topDragLeave:   eventTypes.dragLeave,
  topDragOver:    eventTypes.dragOver,
  topDragStart:   eventTypes.dragStart,
  topDrop:        eventTypes.drop,
  topError:       eventTypes.error,
  topFocus:       eventTypes.focus,
  topInput:       eventTypes.input,
  topKeyDown:     eventTypes.keyDown,
  topKeyPress:    eventTypes.keyPress,
  topKeyUp:       eventTypes.keyUp,
  topLoad:        eventTypes.load,
  topMouseDown:   eventTypes.mouseDown,
  topMouseMove:   eventTypes.mouseMove,
  topMouseOut:    eventTypes.mouseOut,
  topMouseOver:   eventTypes.mouseOver,
  topMouseUp:     eventTypes.mouseUp,
  topPaste:       eventTypes.paste,
  topReset:       eventTypes.reset,
  topScroll:      eventTypes.scroll,
  topSubmit:      eventTypes.submit,
  topTouchCancel: eventTypes.touchCancel,
  topTouchEnd:    eventTypes.touchEnd,
  topTouchMove:   eventTypes.touchMove,
  topTouchStart:  eventTypes.touchStart,
  topWheel:       eventTypes.wheel
};

for (var topLevelType in topLevelEventsToDispatchConfig) {
  topLevelEventsToDispatchConfig[topLevelType].dependencies = [topLevelType];
}

var SimpleEventPlugin = {

  eventTypes: eventTypes,

  /**
   * Same as the default implementation, except cancels the event when return
   * value is false. This behavior will be disabled in a future release.
   *
   * @param {object} Event to be dispatched.
   * @param {function} Application-level callback.
   * @param {string} domID DOM ID to pass to the callback.
   */
  executeDispatch: function(event, listener, domID) {
    var returnValue = EventPluginUtils.executeDispatch(event, listener, domID);

    ("production" !== process.env.NODE_ENV ? warning(
      typeof returnValue !== 'boolean',
      'Returning `false` from an event handler is deprecated and will be ' +
      'ignored in a future release. Instead, manually call ' +
      'e.stopPropagation() or e.preventDefault(), as appropriate.'
    ) : null);

    if (returnValue === false) {
      event.stopPropagation();
      event.preventDefault();
    }
  },

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
    if (!dispatchConfig) {
      return null;
    }
    var EventConstructor;
    switch (topLevelType) {
      case topLevelTypes.topInput:
      case topLevelTypes.topLoad:
      case topLevelTypes.topError:
      case topLevelTypes.topReset:
      case topLevelTypes.topSubmit:
        // HTML Events
        // @see http://www.w3.org/TR/html5/index.html#events-0
        EventConstructor = SyntheticEvent;
        break;
      case topLevelTypes.topKeyPress:
        // FireFox creates a keypress event for function keys too. This removes
        // the unwanted keypress events. Enter is however both printable and
        // non-printable. One would expect Tab to be as well (but it isn't).
        if (getEventCharCode(nativeEvent) === 0) {
          return null;
        }
        /* falls through */
      case topLevelTypes.topKeyDown:
      case topLevelTypes.topKeyUp:
        EventConstructor = SyntheticKeyboardEvent;
        break;
      case topLevelTypes.topBlur:
      case topLevelTypes.topFocus:
        EventConstructor = SyntheticFocusEvent;
        break;
      case topLevelTypes.topClick:
        // Firefox creates a click event on right mouse clicks. This removes the
        // unwanted click events.
        if (nativeEvent.button === 2) {
          return null;
        }
        /* falls through */
      case topLevelTypes.topContextMenu:
      case topLevelTypes.topDoubleClick:
      case topLevelTypes.topMouseDown:
      case topLevelTypes.topMouseMove:
      case topLevelTypes.topMouseOut:
      case topLevelTypes.topMouseOver:
      case topLevelTypes.topMouseUp:
        EventConstructor = SyntheticMouseEvent;
        break;
      case topLevelTypes.topDrag:
      case topLevelTypes.topDragEnd:
      case topLevelTypes.topDragEnter:
      case topLevelTypes.topDragExit:
      case topLevelTypes.topDragLeave:
      case topLevelTypes.topDragOver:
      case topLevelTypes.topDragStart:
      case topLevelTypes.topDrop:
        EventConstructor = SyntheticDragEvent;
        break;
      case topLevelTypes.topTouchCancel:
      case topLevelTypes.topTouchEnd:
      case topLevelTypes.topTouchMove:
      case topLevelTypes.topTouchStart:
        EventConstructor = SyntheticTouchEvent;
        break;
      case topLevelTypes.topScroll:
        EventConstructor = SyntheticUIEvent;
        break;
      case topLevelTypes.topWheel:
        EventConstructor = SyntheticWheelEvent;
        break;
      case topLevelTypes.topCopy:
      case topLevelTypes.topCut:
      case topLevelTypes.topPaste:
        EventConstructor = SyntheticClipboardEvent;
        break;
    }
    ("production" !== process.env.NODE_ENV ? invariant(
      EventConstructor,
      'SimpleEventPlugin: Unhandled event type, `%s`.',
      topLevelType
    ) : invariant(EventConstructor));
    var event = EventConstructor.getPooled(
      dispatchConfig,
      topLevelTargetID,
      nativeEvent
    );
    EventPropagators.accumulateTwoPhaseDispatches(event);
    return event;
  }

};

module.exports = SimpleEventPlugin;

}).call(this,require('_process'))
},{"./EventConstants":48,"./EventPluginUtils":52,"./EventPropagators":53,"./SyntheticClipboardEvent":117,"./SyntheticDragEvent":119,"./SyntheticEvent":120,"./SyntheticFocusEvent":121,"./SyntheticKeyboardEvent":123,"./SyntheticMouseEvent":124,"./SyntheticTouchEvent":125,"./SyntheticUIEvent":126,"./SyntheticWheelEvent":127,"./getEventCharCode":148,"./invariant":160,"./keyOf":167,"./warning":179,"_process":28}],117:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticClipboardEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticEvent = require("./SyntheticEvent");

/**
 * @interface Event
 * @see http://www.w3.org/TR/clipboard-apis/
 */
var ClipboardEventInterface = {
  clipboardData: function(event) {
    return (
      'clipboardData' in event ?
        event.clipboardData :
        window.clipboardData
    );
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticClipboardEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(SyntheticClipboardEvent, ClipboardEventInterface);

module.exports = SyntheticClipboardEvent;


},{"./SyntheticEvent":120}],118:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticCompositionEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticEvent = require("./SyntheticEvent");

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#events-compositionevents
 */
var CompositionEventInterface = {
  data: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticCompositionEvent(
  dispatchConfig,
  dispatchMarker,
  nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(
  SyntheticCompositionEvent,
  CompositionEventInterface
);

module.exports = SyntheticCompositionEvent;


},{"./SyntheticEvent":120}],119:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticDragEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticMouseEvent = require("./SyntheticMouseEvent");

/**
 * @interface DragEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var DragEventInterface = {
  dataTransfer: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticDragEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticMouseEvent.augmentClass(SyntheticDragEvent, DragEventInterface);

module.exports = SyntheticDragEvent;

},{"./SyntheticMouseEvent":124}],120:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticEvent
 * @typechecks static-only
 */

"use strict";

var PooledClass = require("./PooledClass");

var assign = require("./Object.assign");
var emptyFunction = require("./emptyFunction");
var getEventTarget = require("./getEventTarget");

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var EventInterface = {
  type: null,
  target: getEventTarget,
  // currentTarget is set when dispatching; no use in copying it here
  currentTarget: emptyFunction.thatReturnsNull,
  eventPhase: null,
  bubbles: null,
  cancelable: null,
  timeStamp: function(event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: null,
  isTrusted: null
};

/**
 * Synthetic events are dispatched by event plugins, typically in response to a
 * top-level event delegation handler.
 *
 * These systems should generally use pooling to reduce the frequency of garbage
 * collection. The system should check `isPersistent` to determine whether the
 * event should be released into the pool after being dispatched. Users that
 * need a persisted event should invoke `persist`.
 *
 * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
 * normalizing browser quirks. Subclasses do not necessarily have to implement a
 * DOM interface; custom application-specific events can also subclass this.
 *
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 */
function SyntheticEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  this.dispatchConfig = dispatchConfig;
  this.dispatchMarker = dispatchMarker;
  this.nativeEvent = nativeEvent;

  var Interface = this.constructor.Interface;
  for (var propName in Interface) {
    if (!Interface.hasOwnProperty(propName)) {
      continue;
    }
    var normalize = Interface[propName];
    if (normalize) {
      this[propName] = normalize(nativeEvent);
    } else {
      this[propName] = nativeEvent[propName];
    }
  }

  var defaultPrevented = nativeEvent.defaultPrevented != null ?
    nativeEvent.defaultPrevented :
    nativeEvent.returnValue === false;
  if (defaultPrevented) {
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  } else {
    this.isDefaultPrevented = emptyFunction.thatReturnsFalse;
  }
  this.isPropagationStopped = emptyFunction.thatReturnsFalse;
}

assign(SyntheticEvent.prototype, {

  preventDefault: function() {
    this.defaultPrevented = true;
    var event = this.nativeEvent;
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  },

  stopPropagation: function() {
    var event = this.nativeEvent;
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    this.isPropagationStopped = emptyFunction.thatReturnsTrue;
  },

  /**
   * We release all dispatched `SyntheticEvent`s after each event loop, adding
   * them back into the pool. This allows a way to hold onto a reference that
   * won't be added back into the pool.
   */
  persist: function() {
    this.isPersistent = emptyFunction.thatReturnsTrue;
  },

  /**
   * Checks if this event should be released back into the pool.
   *
   * @return {boolean} True if this should not be released, false otherwise.
   */
  isPersistent: emptyFunction.thatReturnsFalse,

  /**
   * `PooledClass` looks for `destructor` on each instance it releases.
   */
  destructor: function() {
    var Interface = this.constructor.Interface;
    for (var propName in Interface) {
      this[propName] = null;
    }
    this.dispatchConfig = null;
    this.dispatchMarker = null;
    this.nativeEvent = null;
  }

});

SyntheticEvent.Interface = EventInterface;

/**
 * Helper to reduce boilerplate when creating subclasses.
 *
 * @param {function} Class
 * @param {?object} Interface
 */
SyntheticEvent.augmentClass = function(Class, Interface) {
  var Super = this;

  var prototype = Object.create(Super.prototype);
  assign(prototype, Class.prototype);
  Class.prototype = prototype;
  Class.prototype.constructor = Class;

  Class.Interface = assign({}, Super.Interface, Interface);
  Class.augmentClass = Super.augmentClass;

  PooledClass.addPoolingTo(Class, PooledClass.threeArgumentPooler);
};

PooledClass.addPoolingTo(SyntheticEvent, PooledClass.threeArgumentPooler);

module.exports = SyntheticEvent;

},{"./Object.assign":59,"./PooledClass":60,"./emptyFunction":141,"./getEventTarget":151}],121:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticFocusEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");

/**
 * @interface FocusEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var FocusEventInterface = {
  relatedTarget: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticFocusEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticFocusEvent, FocusEventInterface);

module.exports = SyntheticFocusEvent;

},{"./SyntheticUIEvent":126}],122:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticInputEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticEvent = require("./SyntheticEvent");

/**
 * @interface Event
 * @see http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105
 *      /#events-inputevents
 */
var InputEventInterface = {
  data: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticInputEvent(
  dispatchConfig,
  dispatchMarker,
  nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(
  SyntheticInputEvent,
  InputEventInterface
);

module.exports = SyntheticInputEvent;


},{"./SyntheticEvent":120}],123:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticKeyboardEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");

var getEventCharCode = require("./getEventCharCode");
var getEventKey = require("./getEventKey");
var getEventModifierState = require("./getEventModifierState");

/**
 * @interface KeyboardEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var KeyboardEventInterface = {
  key: getEventKey,
  location: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  repeat: null,
  locale: null,
  getModifierState: getEventModifierState,
  // Legacy Interface
  charCode: function(event) {
    // `charCode` is the result of a KeyPress event and represents the value of
    // the actual printable character.

    // KeyPress is deprecated, but its replacement is not yet final and not
    // implemented in any major browser. Only KeyPress has charCode.
    if (event.type === 'keypress') {
      return getEventCharCode(event);
    }
    return 0;
  },
  keyCode: function(event) {
    // `keyCode` is the result of a KeyDown/Up event and represents the value of
    // physical keyboard key.

    // The actual meaning of the value depends on the users' keyboard layout
    // which cannot be detected. Assuming that it is a US keyboard layout
    // provides a surprisingly accurate mapping for US and European users.
    // Due to this, it is left to the user to implement at this time.
    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }
    return 0;
  },
  which: function(event) {
    // `which` is an alias for either `keyCode` or `charCode` depending on the
    // type of the event.
    if (event.type === 'keypress') {
      return getEventCharCode(event);
    }
    if (event.type === 'keydown' || event.type === 'keyup') {
      return event.keyCode;
    }
    return 0;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticKeyboardEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticKeyboardEvent, KeyboardEventInterface);

module.exports = SyntheticKeyboardEvent;

},{"./SyntheticUIEvent":126,"./getEventCharCode":148,"./getEventKey":149,"./getEventModifierState":150}],124:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticMouseEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");
var ViewportMetrics = require("./ViewportMetrics");

var getEventModifierState = require("./getEventModifierState");

/**
 * @interface MouseEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var MouseEventInterface = {
  screenX: null,
  screenY: null,
  clientX: null,
  clientY: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  getModifierState: getEventModifierState,
  button: function(event) {
    // Webkit, Firefox, IE9+
    // which:  1 2 3
    // button: 0 1 2 (standard)
    var button = event.button;
    if ('which' in event) {
      return button;
    }
    // IE<9
    // which:  undefined
    // button: 0 0 0
    // button: 1 4 2 (onmouseup)
    return button === 2 ? 2 : button === 4 ? 1 : 0;
  },
  buttons: null,
  relatedTarget: function(event) {
    return event.relatedTarget || (
      event.fromElement === event.srcElement ?
        event.toElement :
        event.fromElement
    );
  },
  // "Proprietary" Interface.
  pageX: function(event) {
    return 'pageX' in event ?
      event.pageX :
      event.clientX + ViewportMetrics.currentScrollLeft;
  },
  pageY: function(event) {
    return 'pageY' in event ?
      event.pageY :
      event.clientY + ViewportMetrics.currentScrollTop;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticMouseEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticMouseEvent, MouseEventInterface);

module.exports = SyntheticMouseEvent;

},{"./SyntheticUIEvent":126,"./ViewportMetrics":129,"./getEventModifierState":150}],125:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticTouchEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");

var getEventModifierState = require("./getEventModifierState");

/**
 * @interface TouchEvent
 * @see http://www.w3.org/TR/touch-events/
 */
var TouchEventInterface = {
  touches: null,
  targetTouches: null,
  changedTouches: null,
  altKey: null,
  metaKey: null,
  ctrlKey: null,
  shiftKey: null,
  getModifierState: getEventModifierState
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticTouchEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticTouchEvent, TouchEventInterface);

module.exports = SyntheticTouchEvent;

},{"./SyntheticUIEvent":126,"./getEventModifierState":150}],126:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticUIEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticEvent = require("./SyntheticEvent");

var getEventTarget = require("./getEventTarget");

/**
 * @interface UIEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var UIEventInterface = {
  view: function(event) {
    if (event.view) {
      return event.view;
    }

    var target = getEventTarget(event);
    if (target != null && target.window === target) {
      // target is a window object
      return target;
    }

    var doc = target.ownerDocument;
    // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
    if (doc) {
      return doc.defaultView || doc.parentWindow;
    } else {
      return window;
    }
  },
  detail: function(event) {
    return event.detail || 0;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
function SyntheticUIEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(SyntheticUIEvent, UIEventInterface);

module.exports = SyntheticUIEvent;

},{"./SyntheticEvent":120,"./getEventTarget":151}],127:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SyntheticWheelEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticMouseEvent = require("./SyntheticMouseEvent");

/**
 * @interface WheelEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var WheelEventInterface = {
  deltaX: function(event) {
    return (
      'deltaX' in event ? event.deltaX :
      // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
      'wheelDeltaX' in event ? -event.wheelDeltaX : 0
    );
  },
  deltaY: function(event) {
    return (
      'deltaY' in event ? event.deltaY :
      // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
      'wheelDeltaY' in event ? -event.wheelDeltaY :
      // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
      'wheelDelta' in event ? -event.wheelDelta : 0
    );
  },
  deltaZ: null,

  // Browsers without "deltaMode" is reporting in raw wheel delta where one
  // notch on the scroll is always +/- 120, roughly equivalent to pixels.
  // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
  // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
  deltaMode: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticMouseEvent}
 */
function SyntheticWheelEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticMouseEvent.augmentClass(SyntheticWheelEvent, WheelEventInterface);

module.exports = SyntheticWheelEvent;

},{"./SyntheticMouseEvent":124}],128:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Transaction
 */

"use strict";

var invariant = require("./invariant");

/**
 * `Transaction` creates a black box that is able to wrap any method such that
 * certain invariants are maintained before and after the method is invoked
 * (Even if an exception is thrown while invoking the wrapped method). Whoever
 * instantiates a transaction can provide enforcers of the invariants at
 * creation time. The `Transaction` class itself will supply one additional
 * automatic invariant for you - the invariant that any transaction instance
 * should not be run while it is already being run. You would typically create a
 * single instance of a `Transaction` for reuse multiple times, that potentially
 * is used to wrap several different methods. Wrappers are extremely simple -
 * they only require implementing two methods.
 *
 * <pre>
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre>
 *
 * Use cases:
 * - Preserving the input selection ranges before/after reconciliation.
 *   Restoring selection even in the event of an unexpected error.
 * - Deactivating events while rearranging the DOM, preventing blurs/focuses,
 *   while guaranteeing that afterwards, the event system is reactivated.
 * - Flushing a queue of collected DOM mutations to the main UI thread after a
 *   reconciliation takes place in a worker thread.
 * - Invoking any collected `componentDidUpdate` callbacks after rendering new
 *   content.
 * - (Future use case): Wrapping particular flushes of the `ReactWorker` queue
 *   to preserve the `scrollTop` (an automatic scroll aware DOM).
 * - (Future use case): Layout calculations before and after DOM upates.
 *
 * Transactional plugin API:
 * - A module that has an `initialize` method that returns any precomputation.
 * - and a `close` method that accepts the precomputation. `close` is invoked
 *   when the wrapped process is completed, or has failed.
 *
 * @param {Array<TransactionalWrapper>} transactionWrapper Wrapper modules
 * that implement `initialize` and `close`.
 * @return {Transaction} Single transaction for reuse in thread.
 *
 * @class Transaction
 */
var Mixin = {
  /**
   * Sets up this instance so that it is prepared for collecting metrics. Does
   * so such that this setup method may be used on an instance that is already
   * initialized, in a way that does not consume additional memory upon reuse.
   * That can be useful if you decide to make your subclass of this mixin a
   * "PooledClass".
   */
  reinitializeTransaction: function() {
    this.transactionWrappers = this.getTransactionWrappers();
    if (!this.wrapperInitData) {
      this.wrapperInitData = [];
    } else {
      this.wrapperInitData.length = 0;
    }
    this._isInTransaction = false;
  },

  _isInTransaction: false,

  /**
   * @abstract
   * @return {Array<TransactionWrapper>} Array of transaction wrappers.
   */
  getTransactionWrappers: null,

  isInTransaction: function() {
    return !!this._isInTransaction;
  },

  /**
   * Executes the function within a safety window. Use this for the top level
   * methods that result in large amounts of computation/mutations that would
   * need to be safety checked.
   *
   * @param {function} method Member of scope to call.
   * @param {Object} scope Scope to invoke from.
   * @param {Object?=} args... Arguments to pass to the method (optional).
   *                           Helps prevent need to bind in many cases.
   * @return Return value from `method`.
   */
  perform: function(method, scope, a, b, c, d, e, f) {
    ("production" !== process.env.NODE_ENV ? invariant(
      !this.isInTransaction(),
      'Transaction.perform(...): Cannot initialize a transaction when there ' +
      'is already an outstanding transaction.'
    ) : invariant(!this.isInTransaction()));
    var errorThrown;
    var ret;
    try {
      this._isInTransaction = true;
      // Catching errors makes debugging more difficult, so we start with
      // errorThrown set to true before setting it to false after calling
      // close -- if it's still set to true in the finally block, it means
      // one of these calls threw.
      errorThrown = true;
      this.initializeAll(0);
      ret = method.call(scope, a, b, c, d, e, f);
      errorThrown = false;
    } finally {
      try {
        if (errorThrown) {
          // If `method` throws, prefer to show that stack trace over any thrown
          // by invoking `closeAll`.
          try {
            this.closeAll(0);
          } catch (err) {
          }
        } else {
          // Since `method` didn't throw, we don't want to silence the exception
          // here.
          this.closeAll(0);
        }
      } finally {
        this._isInTransaction = false;
      }
    }
    return ret;
  },

  initializeAll: function(startIndex) {
    var transactionWrappers = this.transactionWrappers;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      try {
        // Catching errors makes debugging more difficult, so we start with the
        // OBSERVED_ERROR state before overwriting it with the real return value
        // of initialize -- if it's still set to OBSERVED_ERROR in the finally
        // block, it means wrapper.initialize threw.
        this.wrapperInitData[i] = Transaction.OBSERVED_ERROR;
        this.wrapperInitData[i] = wrapper.initialize ?
          wrapper.initialize.call(this) :
          null;
      } finally {
        if (this.wrapperInitData[i] === Transaction.OBSERVED_ERROR) {
          // The initializer for wrapper i threw an error; initialize the
          // remaining wrappers but silence any exceptions from them to ensure
          // that the first error is the one to bubble up.
          try {
            this.initializeAll(i + 1);
          } catch (err) {
          }
        }
      }
    }
  },

  /**
   * Invokes each of `this.transactionWrappers.close[i]` functions, passing into
   * them the respective return values of `this.transactionWrappers.init[i]`
   * (`close`rs that correspond to initializers that failed will not be
   * invoked).
   */
  closeAll: function(startIndex) {
    ("production" !== process.env.NODE_ENV ? invariant(
      this.isInTransaction(),
      'Transaction.closeAll(): Cannot close transaction when none are open.'
    ) : invariant(this.isInTransaction()));
    var transactionWrappers = this.transactionWrappers;
    for (var i = startIndex; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      var initData = this.wrapperInitData[i];
      var errorThrown;
      try {
        // Catching errors makes debugging more difficult, so we start with
        // errorThrown set to true before setting it to false after calling
        // close -- if it's still set to true in the finally block, it means
        // wrapper.close threw.
        errorThrown = true;
        if (initData !== Transaction.OBSERVED_ERROR) {
          wrapper.close && wrapper.close.call(this, initData);
        }
        errorThrown = false;
      } finally {
        if (errorThrown) {
          // The closer for wrapper i threw an error; close the remaining
          // wrappers but silence any exceptions from them to ensure that the
          // first error is the one to bubble up.
          try {
            this.closeAll(i + 1);
          } catch (e) {
          }
        }
      }
    }
    this.wrapperInitData.length = 0;
  }
};

var Transaction = {

  Mixin: Mixin,

  /**
   * Token to look for to determine if an error occured.
   */
  OBSERVED_ERROR: {}

};

module.exports = Transaction;

}).call(this,require('_process'))
},{"./invariant":160,"_process":28}],129:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ViewportMetrics
 */

"use strict";

var getUnboundedScrollPosition = require("./getUnboundedScrollPosition");

var ViewportMetrics = {

  currentScrollLeft: 0,

  currentScrollTop: 0,

  refreshScrollValues: function() {
    var scrollPosition = getUnboundedScrollPosition(window);
    ViewportMetrics.currentScrollLeft = scrollPosition.x;
    ViewportMetrics.currentScrollTop = scrollPosition.y;
  }

};

module.exports = ViewportMetrics;

},{"./getUnboundedScrollPosition":156}],130:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule accumulateInto
 */

"use strict";

var invariant = require("./invariant");

/**
 *
 * Accumulates items that must not be null or undefined into the first one. This
 * is used to conserve memory by avoiding array allocations, and thus sacrifices
 * API cleanness. Since `current` can be null before being passed in and not
 * null after this function, make sure to assign it back to `current`:
 *
 * `a = accumulateInto(a, b);`
 *
 * This API should be sparingly used. Try `accumulate` for something cleaner.
 *
 * @return {*|array<*>} An accumulation of items.
 */

function accumulateInto(current, next) {
  ("production" !== process.env.NODE_ENV ? invariant(
    next != null,
    'accumulateInto(...): Accumulated items must not be null or undefined.'
  ) : invariant(next != null));
  if (current == null) {
    return next;
  }

  // Both are not empty. Warning: Never call x.concat(y) when you are not
  // certain that x is an Array (x could be a string with concat method).
  var currentIsArray = Array.isArray(current);
  var nextIsArray = Array.isArray(next);

  if (currentIsArray && nextIsArray) {
    current.push.apply(current, next);
    return current;
  }

  if (currentIsArray) {
    current.push(next);
    return current;
  }

  if (nextIsArray) {
    // A bit too dangerous to mutate `next`.
    return [current].concat(next);
  }

  return [current, next];
}

module.exports = accumulateInto;

}).call(this,require('_process'))
},{"./invariant":160,"_process":28}],131:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule adler32
 */

/* jslint bitwise:true */

"use strict";

var MOD = 65521;

// This is a clean-room implementation of adler32 designed for detecting
// if markup is not what we expect it to be. It does not need to be
// cryptographically strong, only reasonably good at detecting if markup
// generated on the server is different than that on the client.
function adler32(data) {
  var a = 1;
  var b = 0;
  for (var i = 0; i < data.length; i++) {
    a = (a + data.charCodeAt(i)) % MOD;
    b = (b + a) % MOD;
  }
  return a | (b << 16);
}

module.exports = adler32;

},{}],132:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule camelize
 * @typechecks
 */

var _hyphenPattern = /-(.)/g;

/**
 * Camelcases a hyphenated string, for example:
 *
 *   > camelize('background-color')
 *   < "backgroundColor"
 *
 * @param {string} string
 * @return {string}
 */
function camelize(string) {
  return string.replace(_hyphenPattern, function(_, character) {
    return character.toUpperCase();
  });
}

module.exports = camelize;

},{}],133:[function(require,module,exports){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule camelizeStyleName
 * @typechecks
 */

"use strict";

var camelize = require("./camelize");

var msPattern = /^-ms-/;

/**
 * Camelcases a hyphenated CSS property name, for example:
 *
 *   > camelizeStyleName('background-color')
 *   < "backgroundColor"
 *   > camelizeStyleName('-moz-transition')
 *   < "MozTransition"
 *   > camelizeStyleName('-ms-transition')
 *   < "msTransition"
 *
 * As Andi Smith suggests
 * (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
 * is converted to lowercase `ms`.
 *
 * @param {string} string
 * @return {string}
 */
function camelizeStyleName(string) {
  return camelize(string.replace(msPattern, 'ms-'));
}

module.exports = camelizeStyleName;

},{"./camelize":132}],134:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule containsNode
 * @typechecks
 */

var isTextNode = require("./isTextNode");

/*jslint bitwise:true */

/**
 * Checks if a given DOM node contains or is another DOM node.
 *
 * @param {?DOMNode} outerNode Outer DOM node.
 * @param {?DOMNode} innerNode Inner DOM node.
 * @return {boolean} True if `outerNode` contains or is `innerNode`.
 */
function containsNode(outerNode, innerNode) {
  if (!outerNode || !innerNode) {
    return false;
  } else if (outerNode === innerNode) {
    return true;
  } else if (isTextNode(outerNode)) {
    return false;
  } else if (isTextNode(innerNode)) {
    return containsNode(outerNode, innerNode.parentNode);
  } else if (outerNode.contains) {
    return outerNode.contains(innerNode);
  } else if (outerNode.compareDocumentPosition) {
    return !!(outerNode.compareDocumentPosition(innerNode) & 16);
  } else {
    return false;
  }
}

module.exports = containsNode;

},{"./isTextNode":164}],135:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule copyProperties
 */

/**
 * Copy properties from one or more objects (up to 5) into the first object.
 * This is a shallow copy. It mutates the first object and also returns it.
 *
 * NOTE: `arguments` has a very significant performance penalty, which is why
 * we don't support unlimited arguments.
 */
function copyProperties(obj, a, b, c, d, e, f) {
  obj = obj || {};

  if ("production" !== process.env.NODE_ENV) {
    if (f) {
      throw new Error('Too many arguments passed to copyProperties');
    }
  }

  var args = [a, b, c, d, e];
  var ii = 0, v;
  while (args[ii]) {
    v = args[ii++];
    for (var k in v) {
      obj[k] = v[k];
    }

    // IE ignores toString in object iteration.. See:
    // webreflection.blogspot.com/2007/07/quick-fix-internet-explorer-and.html
    if (v.hasOwnProperty && v.hasOwnProperty('toString') &&
        (typeof v.toString != 'undefined') && (obj.toString !== v.toString)) {
      obj.toString = v.toString;
    }
  }

  return obj;
}

module.exports = copyProperties;

// deprecation notice
console.warn(
  'react/lib/copyProperties has been deprecated and will be removed in the ' +
  'next version of React. All uses can be replaced with ' +
  'Object.assign(obj, a, b, ...) or _.extend(obj, a, b, ...).'
);

}).call(this,require('_process'))
},{"_process":28}],136:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule createArrayFrom
 * @typechecks
 */

var toArray = require("./toArray");

/**
 * Perform a heuristic test to determine if an object is "array-like".
 *
 *   A monk asked Joshu, a Zen master, "Has a dog Buddha nature?"
 *   Joshu replied: "Mu."
 *
 * This function determines if its argument has "array nature": it returns
 * true if the argument is an actual array, an `arguments' object, or an
 * HTMLCollection (e.g. node.childNodes or node.getElementsByTagName()).
 *
 * It will return false for other array-like objects like Filelist.
 *
 * @param {*} obj
 * @return {boolean}
 */
function hasArrayNature(obj) {
  return (
    // not null/false
    !!obj &&
    // arrays are objects, NodeLists are functions in Safari
    (typeof obj == 'object' || typeof obj == 'function') &&
    // quacks like an array
    ('length' in obj) &&
    // not window
    !('setInterval' in obj) &&
    // no DOM node should be considered an array-like
    // a 'select' element has 'length' and 'item' properties on IE8
    (typeof obj.nodeType != 'number') &&
    (
      // a real array
      (// HTMLCollection/NodeList
      (Array.isArray(obj) ||
      // arguments
      ('callee' in obj) || 'item' in obj))
    )
  );
}

/**
 * Ensure that the argument is an array by wrapping it in an array if it is not.
 * Creates a copy of the argument if it is already an array.
 *
 * This is mostly useful idiomatically:
 *
 *   var createArrayFrom = require('createArrayFrom');
 *
 *   function takesOneOrMoreThings(things) {
 *     things = createArrayFrom(things);
 *     ...
 *   }
 *
 * This allows you to treat `things' as an array, but accept scalars in the API.
 *
 * If you need to convert an array-like object, like `arguments`, into an array
 * use toArray instead.
 *
 * @param {*} obj
 * @return {array}
 */
function createArrayFrom(obj) {
  if (!hasArrayNature(obj)) {
    return [obj];
  } else if (Array.isArray(obj)) {
    return obj.slice();
  } else {
    return toArray(obj);
  }
}

module.exports = createArrayFrom;

},{"./toArray":177}],137:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule createFullPageComponent
 * @typechecks
 */

"use strict";

// Defeat circular references by requiring this directly.
var ReactCompositeComponent = require("./ReactCompositeComponent");
var ReactElement = require("./ReactElement");

var invariant = require("./invariant");

/**
 * Create a component that will throw an exception when unmounted.
 *
 * Components like <html> <head> and <body> can't be removed or added
 * easily in a cross-browser way, however it's valuable to be able to
 * take advantage of React's reconciliation for styling and <title>
 * management. So we just document it and throw in dangerous cases.
 *
 * @param {string} tag The tag to wrap
 * @return {function} convenience constructor of new component
 */
function createFullPageComponent(tag) {
  var elementFactory = ReactElement.createFactory(tag);

  var FullPageComponent = ReactCompositeComponent.createClass({
    displayName: 'ReactFullPageComponent' + tag,

    componentWillUnmount: function() {
      ("production" !== process.env.NODE_ENV ? invariant(
        false,
        '%s tried to unmount. Because of cross-browser quirks it is ' +
        'impossible to unmount some top-level components (eg <html>, <head>, ' +
        'and <body>) reliably and efficiently. To fix this, have a single ' +
        'top-level component that never unmounts render these elements.',
        this.constructor.displayName
      ) : invariant(false));
    },

    render: function() {
      return elementFactory(this.props);
    }
  });

  return FullPageComponent;
}

module.exports = createFullPageComponent;

}).call(this,require('_process'))
},{"./ReactCompositeComponent":67,"./ReactElement":85,"./invariant":160,"_process":28}],138:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule createNodesFromMarkup
 * @typechecks
 */

/*jslint evil: true, sub: true */

var ExecutionEnvironment = require("./ExecutionEnvironment");

var createArrayFrom = require("./createArrayFrom");
var getMarkupWrap = require("./getMarkupWrap");
var invariant = require("./invariant");

/**
 * Dummy container used to render all markup.
 */
var dummyNode =
  ExecutionEnvironment.canUseDOM ? document.createElement('div') : null;

/**
 * Pattern used by `getNodeName`.
 */
var nodeNamePattern = /^\s*<(\w+)/;

/**
 * Extracts the `nodeName` of the first element in a string of markup.
 *
 * @param {string} markup String of markup.
 * @return {?string} Node name of the supplied markup.
 */
function getNodeName(markup) {
  var nodeNameMatch = markup.match(nodeNamePattern);
  return nodeNameMatch && nodeNameMatch[1].toLowerCase();
}

/**
 * Creates an array containing the nodes rendered from the supplied markup. The
 * optionally supplied `handleScript` function will be invoked once for each
 * <script> element that is rendered. If no `handleScript` function is supplied,
 * an exception is thrown if any <script> elements are rendered.
 *
 * @param {string} markup A string of valid HTML markup.
 * @param {?function} handleScript Invoked once for each rendered <script>.
 * @return {array<DOMElement|DOMTextNode>} An array of rendered nodes.
 */
function createNodesFromMarkup(markup, handleScript) {
  var node = dummyNode;
  ("production" !== process.env.NODE_ENV ? invariant(!!dummyNode, 'createNodesFromMarkup dummy not initialized') : invariant(!!dummyNode));
  var nodeName = getNodeName(markup);

  var wrap = nodeName && getMarkupWrap(nodeName);
  if (wrap) {
    node.innerHTML = wrap[1] + markup + wrap[2];

    var wrapDepth = wrap[0];
    while (wrapDepth--) {
      node = node.lastChild;
    }
  } else {
    node.innerHTML = markup;
  }

  var scripts = node.getElementsByTagName('script');
  if (scripts.length) {
    ("production" !== process.env.NODE_ENV ? invariant(
      handleScript,
      'createNodesFromMarkup(...): Unexpected <script> element rendered.'
    ) : invariant(handleScript));
    createArrayFrom(scripts).forEach(handleScript);
  }

  var nodes = createArrayFrom(node.childNodes);
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
  return nodes;
}

module.exports = createNodesFromMarkup;

}).call(this,require('_process'))
},{"./ExecutionEnvironment":54,"./createArrayFrom":136,"./getMarkupWrap":152,"./invariant":160,"_process":28}],139:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule dangerousStyleValue
 * @typechecks static-only
 */

"use strict";

var CSSProperty = require("./CSSProperty");

var isUnitlessNumber = CSSProperty.isUnitlessNumber;

/**
 * Convert a value into the proper css writable value. The style name `name`
 * should be logical (no hyphens), as specified
 * in `CSSProperty.isUnitlessNumber`.
 *
 * @param {string} name CSS property name such as `topMargin`.
 * @param {*} value CSS property value such as `10px`.
 * @return {string} Normalized style value with dimensions applied.
 */
function dangerousStyleValue(name, value) {
  // Note that we've removed escapeTextForBrowser() calls here since the
  // whole string will be escaped when the attribute is injected into
  // the markup. If you provide unsafe user data here they can inject
  // arbitrary CSS which may be problematic (I couldn't repro this):
  // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
  // This is not an XSS hole but instead a potential CSS injection issue
  // which has lead to a greater discussion about how we're going to
  // trust URLs moving forward. See #2115901

  var isEmpty = value == null || typeof value === 'boolean' || value === '';
  if (isEmpty) {
    return '';
  }

  var isNonNumeric = isNaN(value);
  if (isNonNumeric || value === 0 ||
      isUnitlessNumber.hasOwnProperty(name) && isUnitlessNumber[name]) {
    return '' + value; // cast to string
  }

  if (typeof value === 'string') {
    value = value.trim();
  }
  return value + 'px';
}

module.exports = dangerousStyleValue;

},{"./CSSProperty":36}],140:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule deprecated
 */

var assign = require("./Object.assign");
var warning = require("./warning");

/**
 * This will log a single deprecation notice per function and forward the call
 * on to the new API.
 *
 * @param {string} namespace The namespace of the call, eg 'React'
 * @param {string} oldName The old function name, eg 'renderComponent'
 * @param {string} newName The new function name, eg 'render'
 * @param {*} ctx The context this forwarded call should run in
 * @param {function} fn The function to forward on to
 * @return {*} Will be the value as returned from `fn`
 */
function deprecated(namespace, oldName, newName, ctx, fn) {
  var warned = false;
  if ("production" !== process.env.NODE_ENV) {
    var newFn = function() {
      ("production" !== process.env.NODE_ENV ? warning(
        warned,
        (namespace + "." + oldName + " will be deprecated in a future version. ") +
        ("Use " + namespace + "." + newName + " instead.")
      ) : null);
      warned = true;
      return fn.apply(ctx, arguments);
    };
    newFn.displayName = (namespace + "_" + oldName);
    // We need to make sure all properties of the original fn are copied over.
    // In particular, this is needed to support PropTypes
    return assign(newFn, fn);
  }

  return fn;
}

module.exports = deprecated;

}).call(this,require('_process'))
},{"./Object.assign":59,"./warning":179,"_process":28}],141:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule emptyFunction
 */

function makeEmptyFunction(arg) {
  return function() {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
function emptyFunction() {}

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function() { return this; };
emptyFunction.thatReturnsArgument = function(arg) { return arg; };

module.exports = emptyFunction;

},{}],142:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule emptyObject
 */

"use strict";

var emptyObject = {};

if ("production" !== process.env.NODE_ENV) {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;

}).call(this,require('_process'))
},{"_process":28}],143:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule escapeTextForBrowser
 * @typechecks static-only
 */

"use strict";

var ESCAPE_LOOKUP = {
  "&": "&amp;",
  ">": "&gt;",
  "<": "&lt;",
  "\"": "&quot;",
  "'": "&#x27;"
};

var ESCAPE_REGEX = /[&><"']/g;

function escaper(match) {
  return ESCAPE_LOOKUP[match];
}

/**
 * Escapes text to prevent scripting attacks.
 *
 * @param {*} text Text value to escape.
 * @return {string} An escaped string.
 */
function escapeTextForBrowser(text) {
  return ('' + text).replace(ESCAPE_REGEX, escaper);
}

module.exports = escapeTextForBrowser;

},{}],144:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule flattenChildren
 */

"use strict";

var ReactTextComponent = require("./ReactTextComponent");

var traverseAllChildren = require("./traverseAllChildren");
var warning = require("./warning");

/**
 * @param {function} traverseContext Context passed through traversal.
 * @param {?ReactComponent} child React child component.
 * @param {!string} name String name of key path to child.
 */
function flattenSingleChildIntoContext(traverseContext, child, name) {
  // We found a component instance.
  var result = traverseContext;
  var keyUnique = !result.hasOwnProperty(name);
  ("production" !== process.env.NODE_ENV ? warning(
    keyUnique,
    'flattenChildren(...): Encountered two children with the same key, ' +
    '`%s`. Child keys must be unique; when two children share a key, only ' +
    'the first child will be used.',
    name
  ) : null);
  if (keyUnique && child != null) {
    var type = typeof child;
    var normalizedValue;

    if (type === 'string') {
      normalizedValue = ReactTextComponent(child);
    } else if (type === 'number') {
      normalizedValue = ReactTextComponent('' + child);
    } else {
      normalizedValue = child;
    }

    result[name] = normalizedValue;
  }
}

/**
 * Flattens children that are typically specified as `props.children`. Any null
 * children will not be included in the resulting object.
 * @return {!object} flattened children keyed by name.
 */
function flattenChildren(children) {
  if (children == null) {
    return children;
  }
  var result = {};
  traverseAllChildren(children, flattenSingleChildIntoContext, result);
  return result;
}

module.exports = flattenChildren;

}).call(this,require('_process'))
},{"./ReactTextComponent":111,"./traverseAllChildren":178,"./warning":179,"_process":28}],145:[function(require,module,exports){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule focusNode
 */

"use strict";

/**
 * @param {DOMElement} node input/textarea to focus
 */
function focusNode(node) {
  // IE8 can throw "Can't move focus to the control because it is invisible,
  // not enabled, or of a type that does not accept the focus." for all kinds of
  // reasons that are too expensive and fragile to test.
  try {
    node.focus();
  } catch(e) {
  }
}

module.exports = focusNode;

},{}],146:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule forEachAccumulated
 */

"use strict";

/**
 * @param {array} an "accumulation" of items which is either an Array or
 * a single item. Useful when paired with the `accumulate` module. This is a
 * simple utility that allows us to reason about a collection of items, but
 * handling the case when there is exactly one item (and we do not need to
 * allocate an array).
 */
var forEachAccumulated = function(arr, cb, scope) {
  if (Array.isArray(arr)) {
    arr.forEach(cb, scope);
  } else if (arr) {
    cb.call(scope, arr);
  }
};

module.exports = forEachAccumulated;

},{}],147:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getActiveElement
 * @typechecks
 */

/**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 *
 * The activeElement will be null only if the document body is not yet defined.
 */
function getActiveElement() /*?DOMElement*/ {
  try {
    return document.activeElement || document.body;
  } catch (e) {
    return document.body;
  }
}

module.exports = getActiveElement;

},{}],148:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getEventCharCode
 * @typechecks static-only
 */

"use strict";

/**
 * `charCode` represents the actual "character code" and is safe to use with
 * `String.fromCharCode`. As such, only keys that correspond to printable
 * characters produce a valid `charCode`, the only exception to this is Enter.
 * The Tab-key is considered non-printable and does not have a `charCode`,
 * presumably because it does not produce a tab-character in browsers.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {string} Normalized `charCode` property.
 */
function getEventCharCode(nativeEvent) {
  var charCode;
  var keyCode = nativeEvent.keyCode;

  if ('charCode' in nativeEvent) {
    charCode = nativeEvent.charCode;

    // FF does not set `charCode` for the Enter-key, check against `keyCode`.
    if (charCode === 0 && keyCode === 13) {
      charCode = 13;
    }
  } else {
    // IE8 does not implement `charCode`, but `keyCode` has the correct value.
    charCode = keyCode;
  }

  // Some non-printable keys are reported in `charCode`/`keyCode`, discard them.
  // Must not discard the (non-)printable Enter-key.
  if (charCode >= 32 || charCode === 13) {
    return charCode;
  }

  return 0;
}

module.exports = getEventCharCode;

},{}],149:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getEventKey
 * @typechecks static-only
 */

"use strict";

var getEventCharCode = require("./getEventCharCode");

/**
 * Normalization of deprecated HTML5 `key` values
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
var normalizeKey = {
  'Esc': 'Escape',
  'Spacebar': ' ',
  'Left': 'ArrowLeft',
  'Up': 'ArrowUp',
  'Right': 'ArrowRight',
  'Down': 'ArrowDown',
  'Del': 'Delete',
  'Win': 'OS',
  'Menu': 'ContextMenu',
  'Apps': 'ContextMenu',
  'Scroll': 'ScrollLock',
  'MozPrintableKey': 'Unidentified'
};

/**
 * Translation from legacy `keyCode` to HTML5 `key`
 * Only special keys supported, all others depend on keyboard layout or browser
 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
 */
var translateToKey = {
  8: 'Backspace',
  9: 'Tab',
  12: 'Clear',
  13: 'Enter',
  16: 'Shift',
  17: 'Control',
  18: 'Alt',
  19: 'Pause',
  20: 'CapsLock',
  27: 'Escape',
  32: ' ',
  33: 'PageUp',
  34: 'PageDown',
  35: 'End',
  36: 'Home',
  37: 'ArrowLeft',
  38: 'ArrowUp',
  39: 'ArrowRight',
  40: 'ArrowDown',
  45: 'Insert',
  46: 'Delete',
  112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6',
  118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
  144: 'NumLock',
  145: 'ScrollLock',
  224: 'Meta'
};

/**
 * @param {object} nativeEvent Native browser event.
 * @return {string} Normalized `key` property.
 */
function getEventKey(nativeEvent) {
  if (nativeEvent.key) {
    // Normalize inconsistent values reported by browsers due to
    // implementations of a working draft specification.

    // FireFox implements `key` but returns `MozPrintableKey` for all
    // printable characters (normalized to `Unidentified`), ignore it.
    var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
    if (key !== 'Unidentified') {
      return key;
    }
  }

  // Browser does not implement `key`, polyfill as much of it as we can.
  if (nativeEvent.type === 'keypress') {
    var charCode = getEventCharCode(nativeEvent);

    // The enter-key is technically both printable and non-printable and can
    // thus be captured by `keypress`, no other non-printable key should.
    return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
  }
  if (nativeEvent.type === 'keydown' || nativeEvent.type === 'keyup') {
    // While user keyboard layout determines the actual meaning of each
    // `keyCode` value, almost all function keys have a universal value.
    return translateToKey[nativeEvent.keyCode] || 'Unidentified';
  }
  return '';
}

module.exports = getEventKey;

},{"./getEventCharCode":148}],150:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getEventModifierState
 * @typechecks static-only
 */

"use strict";

/**
 * Translation from modifier key to the associated property in the event.
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
 */

var modifierKeyToProp = {
  'Alt': 'altKey',
  'Control': 'ctrlKey',
  'Meta': 'metaKey',
  'Shift': 'shiftKey'
};

// IE8 does not implement getModifierState so we simply map it to the only
// modifier keys exposed by the event itself, does not support Lock-keys.
// Currently, all major browsers except Chrome seems to support Lock-keys.
function modifierStateGetter(keyArg) {
  /*jshint validthis:true */
  var syntheticEvent = this;
  var nativeEvent = syntheticEvent.nativeEvent;
  if (nativeEvent.getModifierState) {
    return nativeEvent.getModifierState(keyArg);
  }
  var keyProp = modifierKeyToProp[keyArg];
  return keyProp ? !!nativeEvent[keyProp] : false;
}

function getEventModifierState(nativeEvent) {
  return modifierStateGetter;
}

module.exports = getEventModifierState;

},{}],151:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getEventTarget
 * @typechecks static-only
 */

"use strict";

/**
 * Gets the target node from a native browser event by accounting for
 * inconsistencies in browser DOM APIs.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {DOMEventTarget} Target node.
 */
function getEventTarget(nativeEvent) {
  var target = nativeEvent.target || nativeEvent.srcElement || window;
  // Safari may fire events on text nodes (Node.TEXT_NODE is 3).
  // @see http://www.quirksmode.org/js/events_properties.html
  return target.nodeType === 3 ? target.parentNode : target;
}

module.exports = getEventTarget;

},{}],152:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getMarkupWrap
 */

var ExecutionEnvironment = require("./ExecutionEnvironment");

var invariant = require("./invariant");

/**
 * Dummy container used to detect which wraps are necessary.
 */
var dummyNode =
  ExecutionEnvironment.canUseDOM ? document.createElement('div') : null;

/**
 * Some browsers cannot use `innerHTML` to render certain elements standalone,
 * so we wrap them, render the wrapped nodes, then extract the desired node.
 *
 * In IE8, certain elements cannot render alone, so wrap all elements ('*').
 */
var shouldWrap = {
  // Force wrapping for SVG elements because if they get created inside a <div>,
  // they will be initialized in the wrong namespace (and will not display).
  'circle': true,
  'defs': true,
  'ellipse': true,
  'g': true,
  'line': true,
  'linearGradient': true,
  'path': true,
  'polygon': true,
  'polyline': true,
  'radialGradient': true,
  'rect': true,
  'stop': true,
  'text': true
};

var selectWrap = [1, '<select multiple="true">', '</select>'];
var tableWrap = [1, '<table>', '</table>'];
var trWrap = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

var svgWrap = [1, '<svg>', '</svg>'];

var markupWrap = {
  '*': [1, '?<div>', '</div>'],

  'area': [1, '<map>', '</map>'],
  'col': [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  'legend': [1, '<fieldset>', '</fieldset>'],
  'param': [1, '<object>', '</object>'],
  'tr': [2, '<table><tbody>', '</tbody></table>'],

  'optgroup': selectWrap,
  'option': selectWrap,

  'caption': tableWrap,
  'colgroup': tableWrap,
  'tbody': tableWrap,
  'tfoot': tableWrap,
  'thead': tableWrap,

  'td': trWrap,
  'th': trWrap,

  'circle': svgWrap,
  'defs': svgWrap,
  'ellipse': svgWrap,
  'g': svgWrap,
  'line': svgWrap,
  'linearGradient': svgWrap,
  'path': svgWrap,
  'polygon': svgWrap,
  'polyline': svgWrap,
  'radialGradient': svgWrap,
  'rect': svgWrap,
  'stop': svgWrap,
  'text': svgWrap
};

/**
 * Gets the markup wrap configuration for the supplied `nodeName`.
 *
 * NOTE: This lazily detects which wraps are necessary for the current browser.
 *
 * @param {string} nodeName Lowercase `nodeName`.
 * @return {?array} Markup wrap configuration, if applicable.
 */
function getMarkupWrap(nodeName) {
  ("production" !== process.env.NODE_ENV ? invariant(!!dummyNode, 'Markup wrapping node not initialized') : invariant(!!dummyNode));
  if (!markupWrap.hasOwnProperty(nodeName)) {
    nodeName = '*';
  }
  if (!shouldWrap.hasOwnProperty(nodeName)) {
    if (nodeName === '*') {
      dummyNode.innerHTML = '<link />';
    } else {
      dummyNode.innerHTML = '<' + nodeName + '></' + nodeName + '>';
    }
    shouldWrap[nodeName] = !dummyNode.firstChild;
  }
  return shouldWrap[nodeName] ? markupWrap[nodeName] : null;
}


module.exports = getMarkupWrap;

}).call(this,require('_process'))
},{"./ExecutionEnvironment":54,"./invariant":160,"_process":28}],153:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getNodeForCharacterOffset
 */

"use strict";

/**
 * Given any node return the first leaf node without children.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {DOMElement|DOMTextNode}
 */
function getLeafNode(node) {
  while (node && node.firstChild) {
    node = node.firstChild;
  }
  return node;
}

/**
 * Get the next sibling within a container. This will walk up the
 * DOM if a node's siblings have been exhausted.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {?DOMElement|DOMTextNode}
 */
function getSiblingNode(node) {
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    node = node.parentNode;
  }
}

/**
 * Get object describing the nodes which contain characters at offset.
 *
 * @param {DOMElement|DOMTextNode} root
 * @param {number} offset
 * @return {?object}
 */
function getNodeForCharacterOffset(root, offset) {
  var node = getLeafNode(root);
  var nodeStart = 0;
  var nodeEnd = 0;

  while (node) {
    if (node.nodeType == 3) {
      nodeEnd = nodeStart + node.textContent.length;

      if (nodeStart <= offset && nodeEnd >= offset) {
        return {
          node: node,
          offset: offset - nodeStart
        };
      }

      nodeStart = nodeEnd;
    }

    node = getLeafNode(getSiblingNode(node));
  }
}

module.exports = getNodeForCharacterOffset;

},{}],154:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getReactRootElementInContainer
 */

"use strict";

var DOC_NODE_TYPE = 9;

/**
 * @param {DOMElement|DOMDocument} container DOM element that may contain
 *                                           a React component
 * @return {?*} DOM element that may have the reactRoot ID, or null.
 */
function getReactRootElementInContainer(container) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOC_NODE_TYPE) {
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}

module.exports = getReactRootElementInContainer;

},{}],155:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getTextContentAccessor
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var contentKey = null;

/**
 * Gets the key used to access text content on a DOM node.
 *
 * @return {?string} Key used to access text content.
 * @internal
 */
function getTextContentAccessor() {
  if (!contentKey && ExecutionEnvironment.canUseDOM) {
    // Prefer textContent to innerText because many browsers support both but
    // SVG <text> elements don't support innerText even when <div> does.
    contentKey = 'textContent' in document.documentElement ?
      'textContent' :
      'innerText';
  }
  return contentKey;
}

module.exports = getTextContentAccessor;

},{"./ExecutionEnvironment":54}],156:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getUnboundedScrollPosition
 * @typechecks
 */

"use strict";

/**
 * Gets the scroll position of the supplied element or window.
 *
 * The return values are unbounded, unlike `getScrollPosition`. This means they
 * may be negative or exceed the element boundaries (which is possible using
 * inertial scrolling).
 *
 * @param {DOMWindow|DOMElement} scrollable
 * @return {object} Map with `x` and `y` keys.
 */
function getUnboundedScrollPosition(scrollable) {
  if (scrollable === window) {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    };
  }
  return {
    x: scrollable.scrollLeft,
    y: scrollable.scrollTop
  };
}

module.exports = getUnboundedScrollPosition;

},{}],157:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule hyphenate
 * @typechecks
 */

var _uppercasePattern = /([A-Z])/g;

/**
 * Hyphenates a camelcased string, for example:
 *
 *   > hyphenate('backgroundColor')
 *   < "background-color"
 *
 * For CSS style names, use `hyphenateStyleName` instead which works properly
 * with all vendor prefixes, including `ms`.
 *
 * @param {string} string
 * @return {string}
 */
function hyphenate(string) {
  return string.replace(_uppercasePattern, '-$1').toLowerCase();
}

module.exports = hyphenate;

},{}],158:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule hyphenateStyleName
 * @typechecks
 */

"use strict";

var hyphenate = require("./hyphenate");

var msPattern = /^ms-/;

/**
 * Hyphenates a camelcased CSS property name, for example:
 *
 *   > hyphenateStyleName('backgroundColor')
 *   < "background-color"
 *   > hyphenateStyleName('MozTransition')
 *   < "-moz-transition"
 *   > hyphenateStyleName('msTransition')
 *   < "-ms-transition"
 *
 * As Modernizr suggests (http://modernizr.com/docs/#prefixed), an `ms` prefix
 * is converted to `-ms-`.
 *
 * @param {string} string
 * @return {string}
 */
function hyphenateStyleName(string) {
  return hyphenate(string).replace(msPattern, '-ms-');
}

module.exports = hyphenateStyleName;

},{"./hyphenate":157}],159:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule instantiateReactComponent
 * @typechecks static-only
 */

"use strict";

var warning = require("./warning");

var ReactElement = require("./ReactElement");
var ReactLegacyElement = require("./ReactLegacyElement");
var ReactNativeComponent = require("./ReactNativeComponent");
var ReactEmptyComponent = require("./ReactEmptyComponent");

/**
 * Given an `element` create an instance that will actually be mounted.
 *
 * @param {object} element
 * @param {*} parentCompositeType The composite type that resolved this.
 * @return {object} A new instance of the element's constructor.
 * @protected
 */
function instantiateReactComponent(element, parentCompositeType) {
  var instance;

  if ("production" !== process.env.NODE_ENV) {
    ("production" !== process.env.NODE_ENV ? warning(
      element && (typeof element.type === 'function' ||
                     typeof element.type === 'string'),
      'Only functions or strings can be mounted as React components.'
    ) : null);

    // Resolve mock instances
    if (element.type._mockedReactClassConstructor) {
      // If this is a mocked class, we treat the legacy factory as if it was the
      // class constructor for future proofing unit tests. Because this might
      // be mocked as a legacy factory, we ignore any warnings triggerd by
      // this temporary hack.
      ReactLegacyElement._isLegacyCallWarningEnabled = false;
      try {
        instance = new element.type._mockedReactClassConstructor(
          element.props
        );
      } finally {
        ReactLegacyElement._isLegacyCallWarningEnabled = true;
      }

      // If the mock implementation was a legacy factory, then it returns a
      // element. We need to turn this into a real component instance.
      if (ReactElement.isValidElement(instance)) {
        instance = new instance.type(instance.props);
      }

      var render = instance.render;
      if (!render) {
        // For auto-mocked factories, the prototype isn't shimmed and therefore
        // there is no render function on the instance. We replace the whole
        // component with an empty component instance instead.
        element = ReactEmptyComponent.getEmptyComponent();
      } else {
        if (render._isMockFunction && !render._getMockImplementation()) {
          // Auto-mocked components may have a prototype with a mocked render
          // function. For those, we'll need to mock the result of the render
          // since we consider undefined to be invalid results from render.
          render.mockImplementation(
            ReactEmptyComponent.getEmptyComponent
          );
        }
        instance.construct(element);
        return instance;
      }
    }
  }

  // Special case string values
  if (typeof element.type === 'string') {
    instance = ReactNativeComponent.createInstanceForTag(
      element.type,
      element.props,
      parentCompositeType
    );
  } else {
    // Normal case for non-mocks and non-strings
    instance = new element.type(element.props);
  }

  if ("production" !== process.env.NODE_ENV) {
    ("production" !== process.env.NODE_ENV ? warning(
      typeof instance.construct === 'function' &&
      typeof instance.mountComponent === 'function' &&
      typeof instance.receiveComponent === 'function',
      'Only React Components can be mounted.'
    ) : null);
  }

  // This actually sets up the internal instance. This will become decoupled
  // from the public instance in a future diff.
  instance.construct(element);

  return instance;
}

module.exports = instantiateReactComponent;

}).call(this,require('_process'))
},{"./ReactElement":85,"./ReactEmptyComponent":87,"./ReactLegacyElement":94,"./ReactNativeComponent":99,"./warning":179,"_process":28}],160:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if ("production" !== process.env.NODE_ENV) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require('_process'))
},{"_process":28}],161:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isEventSupported
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var useHasFeature;
if (ExecutionEnvironment.canUseDOM) {
  useHasFeature =
    document.implementation &&
    document.implementation.hasFeature &&
    // always returns true in newer browsers as per the standard.
    // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
    document.implementation.hasFeature('', '') !== true;
}

/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
function isEventSupported(eventNameSuffix, capture) {
  if (!ExecutionEnvironment.canUseDOM ||
      capture && !('addEventListener' in document)) {
    return false;
  }

  var eventName = 'on' + eventNameSuffix;
  var isSupported = eventName in document;

  if (!isSupported) {
    var element = document.createElement('div');
    element.setAttribute(eventName, 'return;');
    isSupported = typeof element[eventName] === 'function';
  }

  if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
    // This is the only way to test support for the `wheel` event in IE9+.
    isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
  }

  return isSupported;
}

module.exports = isEventSupported;

},{"./ExecutionEnvironment":54}],162:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isNode
 * @typechecks
 */

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM node.
 */
function isNode(object) {
  return !!(object && (
    typeof Node === 'function' ? object instanceof Node :
      typeof object === 'object' &&
      typeof object.nodeType === 'number' &&
      typeof object.nodeName === 'string'
  ));
}

module.exports = isNode;

},{}],163:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isTextInputElement
 */

"use strict";

/**
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
 */
var supportedInputTypes = {
  'color': true,
  'date': true,
  'datetime': true,
  'datetime-local': true,
  'email': true,
  'month': true,
  'number': true,
  'password': true,
  'range': true,
  'search': true,
  'tel': true,
  'text': true,
  'time': true,
  'url': true,
  'week': true
};

function isTextInputElement(elem) {
  return elem && (
    (elem.nodeName === 'INPUT' && supportedInputTypes[elem.type]) ||
    elem.nodeName === 'TEXTAREA'
  );
}

module.exports = isTextInputElement;

},{}],164:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isTextNode
 * @typechecks
 */

var isNode = require("./isNode");

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM text node.
 */
function isTextNode(object) {
  return isNode(object) && object.nodeType == 3;
}

module.exports = isTextNode;

},{"./isNode":162}],165:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule joinClasses
 * @typechecks static-only
 */

"use strict";

/**
 * Combines multiple className strings into one.
 * http://jsperf.com/joinclasses-args-vs-array
 *
 * @param {...?string} classes
 * @return {string}
 */
function joinClasses(className/*, ... */) {
  if (!className) {
    className = '';
  }
  var nextClass;
  var argLength = arguments.length;
  if (argLength > 1) {
    for (var ii = 1; ii < argLength; ii++) {
      nextClass = arguments[ii];
      if (nextClass) {
        className = (className ? className + ' ' : '') + nextClass;
      }
    }
  }
  return className;
}

module.exports = joinClasses;

},{}],166:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule keyMirror
 * @typechecks static-only
 */

"use strict";

var invariant = require("./invariant");

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  ("production" !== process.env.NODE_ENV ? invariant(
    obj instanceof Object && !Array.isArray(obj),
    'keyMirror(...): Argument must be an object.'
  ) : invariant(obj instanceof Object && !Array.isArray(obj)));
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

}).call(this,require('_process'))
},{"./invariant":160,"_process":28}],167:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule keyOf
 */

/**
 * Allows extraction of a minified key. Let's the build system minify keys
 * without loosing the ability to dynamically use key strings as values
 * themselves. Pass in an object with a single key/val pair and it will return
 * you the string key of that single record. Suppose you want to grab the
 * value for a key 'className' inside of an object. Key/val minification may
 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
 * reuse those resolutions.
 */
var keyOf = function(oneKeyObj) {
  var key;
  for (key in oneKeyObj) {
    if (!oneKeyObj.hasOwnProperty(key)) {
      continue;
    }
    return key;
  }
  return null;
};


module.exports = keyOf;

},{}],168:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule mapObject
 */

'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Executes the provided `callback` once for each enumerable own property in the
 * object and constructs a new object from the results. The `callback` is
 * invoked with three arguments:
 *
 *  - the property value
 *  - the property name
 *  - the object being traversed
 *
 * Properties that are added after the call to `mapObject` will not be visited
 * by `callback`. If the values of existing properties are changed, the value
 * passed to `callback` will be the value at the time `mapObject` visits them.
 * Properties that are deleted before being visited are not visited.
 *
 * @grep function objectMap()
 * @grep function objMap()
 *
 * @param {?object} object
 * @param {function} callback
 * @param {*} context
 * @return {?object}
 */
function mapObject(object, callback, context) {
  if (!object) {
    return null;
  }
  var result = {};
  for (var name in object) {
    if (hasOwnProperty.call(object, name)) {
      result[name] = callback.call(context, object[name], name, object);
    }
  }
  return result;
}

module.exports = mapObject;

},{}],169:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule memoizeStringOnly
 * @typechecks static-only
 */

"use strict";

/**
 * Memoizes the return value of a function that accepts one string argument.
 *
 * @param {function} callback
 * @return {function}
 */
function memoizeStringOnly(callback) {
  var cache = {};
  return function(string) {
    if (cache.hasOwnProperty(string)) {
      return cache[string];
    } else {
      return cache[string] = callback.call(this, string);
    }
  };
}

module.exports = memoizeStringOnly;

},{}],170:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule monitorCodeUse
 */

"use strict";

var invariant = require("./invariant");

/**
 * Provides open-source compatible instrumentation for monitoring certain API
 * uses before we're ready to issue a warning or refactor. It accepts an event
 * name which may only contain the characters [a-z0-9_] and an optional data
 * object with further information.
 */

function monitorCodeUse(eventName, data) {
  ("production" !== process.env.NODE_ENV ? invariant(
    eventName && !/[^a-z0-9_]/.test(eventName),
    'You must provide an eventName using only the characters [a-z0-9_]'
  ) : invariant(eventName && !/[^a-z0-9_]/.test(eventName)));
}

module.exports = monitorCodeUse;

}).call(this,require('_process'))
},{"./invariant":160,"_process":28}],171:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule onlyChild
 */
"use strict";

var ReactElement = require("./ReactElement");

var invariant = require("./invariant");

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection. The current implementation of this
 * function assumes that a single child gets passed without a wrapper, but the
 * purpose of this helper function is to abstract away the particular structure
 * of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactComponent} The first and only `ReactComponent` contained in the
 * structure.
 */
function onlyChild(children) {
  ("production" !== process.env.NODE_ENV ? invariant(
    ReactElement.isValidElement(children),
    'onlyChild must be passed a children with exactly one child.'
  ) : invariant(ReactElement.isValidElement(children)));
  return children;
}

module.exports = onlyChild;

}).call(this,require('_process'))
},{"./ReactElement":85,"./invariant":160,"_process":28}],172:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule performance
 * @typechecks
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var performance;

if (ExecutionEnvironment.canUseDOM) {
  performance =
    window.performance ||
    window.msPerformance ||
    window.webkitPerformance;
}

module.exports = performance || {};

},{"./ExecutionEnvironment":54}],173:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule performanceNow
 * @typechecks
 */

var performance = require("./performance");

/**
 * Detect if we can use `window.performance.now()` and gracefully fallback to
 * `Date.now()` if it doesn't exist. We need to support Firefox < 15 for now
 * because of Facebook's testing infrastructure.
 */
if (!performance || !performance.now) {
  performance = Date;
}

var performanceNow = performance.now.bind(performance);

module.exports = performanceNow;

},{"./performance":172}],174:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule setInnerHTML
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var WHITESPACE_TEST = /^[ \r\n\t\f]/;
var NONVISIBLE_TEST = /<(!--|link|noscript|meta|script|style)[ \r\n\t\f\/>]/;

/**
 * Set the innerHTML property of a node, ensuring that whitespace is preserved
 * even in IE8.
 *
 * @param {DOMElement} node
 * @param {string} html
 * @internal
 */
var setInnerHTML = function(node, html) {
  node.innerHTML = html;
};

if (ExecutionEnvironment.canUseDOM) {
  // IE8: When updating a just created node with innerHTML only leading
  // whitespace is removed. When updating an existing node with innerHTML
  // whitespace in root TextNodes is also collapsed.
  // @see quirksmode.org/bugreports/archives/2004/11/innerhtml_and_t.html

  // Feature detection; only IE8 is known to behave improperly like this.
  var testElement = document.createElement('div');
  testElement.innerHTML = ' ';
  if (testElement.innerHTML === '') {
    setInnerHTML = function(node, html) {
      // Magic theory: IE8 supposedly differentiates between added and updated
      // nodes when processing innerHTML, innerHTML on updated nodes suffers
      // from worse whitespace behavior. Re-adding a node like this triggers
      // the initial and more favorable whitespace behavior.
      // TODO: What to do on a detached node?
      if (node.parentNode) {
        node.parentNode.replaceChild(node, node);
      }

      // We also implement a workaround for non-visible tags disappearing into
      // thin air on IE8, this only happens if there is no visible text
      // in-front of the non-visible tags. Piggyback on the whitespace fix
      // and simply check if any non-visible tags appear in the source.
      if (WHITESPACE_TEST.test(html) ||
          html[0] === '<' && NONVISIBLE_TEST.test(html)) {
        // Recover leading whitespace by temporarily prepending any character.
        // \uFEFF has the potential advantage of being zero-width/invisible.
        node.innerHTML = '\uFEFF' + html;

        // deleteData leaves an empty `TextNode` which offsets the index of all
        // children. Definitely want to avoid this.
        var textNode = node.firstChild;
        if (textNode.data.length === 1) {
          node.removeChild(textNode);
        } else {
          textNode.deleteData(0, 1);
        }
      } else {
        node.innerHTML = html;
      }
    };
  }
}

module.exports = setInnerHTML;

},{"./ExecutionEnvironment":54}],175:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule shallowEqual
 */

"use strict";

/**
 * Performs equality by iterating through keys on an object and returning
 * false when any key has values which are not strictly equal between
 * objA and objB. Returns true when the values of all keys are strictly equal.
 *
 * @return {boolean}
 */
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }
  var key;
  // Test for A's keys different from B.
  for (key in objA) {
    if (objA.hasOwnProperty(key) &&
        (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
      return false;
    }
  }
  // Test for B's keys missing from A.
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

module.exports = shallowEqual;

},{}],176:[function(require,module,exports){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule shouldUpdateReactComponent
 * @typechecks static-only
 */

"use strict";

/**
 * Given a `prevElement` and `nextElement`, determines if the existing
 * instance should be updated as opposed to being destroyed or replaced by a new
 * instance. Both arguments are elements. This ensures that this logic can
 * operate on stateless trees without any backing instance.
 *
 * @param {?object} prevElement
 * @param {?object} nextElement
 * @return {boolean} True if the existing instance should be updated.
 * @protected
 */
function shouldUpdateReactComponent(prevElement, nextElement) {
  if (prevElement && nextElement &&
      prevElement.type === nextElement.type &&
      prevElement.key === nextElement.key &&
      prevElement._owner === nextElement._owner) {
    return true;
  }
  return false;
}

module.exports = shouldUpdateReactComponent;

},{}],177:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule toArray
 * @typechecks
 */

var invariant = require("./invariant");

/**
 * Convert array-like objects to arrays.
 *
 * This API assumes the caller knows the contents of the data type. For less
 * well defined inputs use createArrayFrom.
 *
 * @param {object|function|filelist} obj
 * @return {array}
 */
function toArray(obj) {
  var length = obj.length;

  // Some browse builtin objects can report typeof 'function' (e.g. NodeList in
  // old versions of Safari).
  ("production" !== process.env.NODE_ENV ? invariant(
    !Array.isArray(obj) &&
    (typeof obj === 'object' || typeof obj === 'function'),
    'toArray: Array-like object expected'
  ) : invariant(!Array.isArray(obj) &&
  (typeof obj === 'object' || typeof obj === 'function')));

  ("production" !== process.env.NODE_ENV ? invariant(
    typeof length === 'number',
    'toArray: Object needs a length property'
  ) : invariant(typeof length === 'number'));

  ("production" !== process.env.NODE_ENV ? invariant(
    length === 0 ||
    (length - 1) in obj,
    'toArray: Object should have keys for indices'
  ) : invariant(length === 0 ||
  (length - 1) in obj));

  // Old IE doesn't give collections access to hasOwnProperty. Assume inputs
  // without method will throw during the slice call and skip straight to the
  // fallback.
  if (obj.hasOwnProperty) {
    try {
      return Array.prototype.slice.call(obj);
    } catch (e) {
      // IE < 9 does not support Array#slice on collections objects
    }
  }

  // Fall back to copying key by key. This assumes all keys have a value,
  // so will not preserve sparsely populated inputs.
  var ret = Array(length);
  for (var ii = 0; ii < length; ii++) {
    ret[ii] = obj[ii];
  }
  return ret;
}

module.exports = toArray;

}).call(this,require('_process'))
},{"./invariant":160,"_process":28}],178:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule traverseAllChildren
 */

"use strict";

var ReactElement = require("./ReactElement");
var ReactInstanceHandles = require("./ReactInstanceHandles");

var invariant = require("./invariant");

var SEPARATOR = ReactInstanceHandles.SEPARATOR;
var SUBSEPARATOR = ':';

/**
 * TODO: Test that:
 * 1. `mapChildren` transforms strings and numbers into `ReactTextComponent`.
 * 2. it('should fail when supplied duplicate key', function() {
 * 3. That a single child and an array with one item have the same key pattern.
 * });
 */

var userProvidedKeyEscaperLookup = {
  '=': '=0',
  '.': '=1',
  ':': '=2'
};

var userProvidedKeyEscapeRegex = /[=.:]/g;

function userProvidedKeyEscaper(match) {
  return userProvidedKeyEscaperLookup[match];
}

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  if (component && component.key != null) {
    // Explicit key
    return wrapUserProvidedKey(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

/**
 * Escape a component key so that it is safe to use in a reactid.
 *
 * @param {*} key Component key to be escaped.
 * @return {string} An escaped string.
 */
function escapeUserProvidedKey(text) {
  return ('' + text).replace(
    userProvidedKeyEscapeRegex,
    userProvidedKeyEscaper
  );
}

/**
 * Wrap a `key` value explicitly provided by the user to distinguish it from
 * implicitly-generated keys generated by a component's index in its parent.
 *
 * @param {string} key Value of a user-provided `key` attribute
 * @return {string}
 */
function wrapUserProvidedKey(key) {
  return '$' + escapeUserProvidedKey(key);
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!number} indexSoFar Number of children encountered until this point.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
var traverseAllChildrenImpl =
  function(children, nameSoFar, indexSoFar, callback, traverseContext) {
    var nextName, nextIndex;
    var subtreeCount = 0;  // Count of children found in the current subtree.
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        nextName = (
          nameSoFar +
          (nameSoFar ? SUBSEPARATOR : SEPARATOR) +
          getComponentKey(child, i)
        );
        nextIndex = indexSoFar + subtreeCount;
        subtreeCount += traverseAllChildrenImpl(
          child,
          nextName,
          nextIndex,
          callback,
          traverseContext
        );
      }
    } else {
      var type = typeof children;
      var isOnlyChild = nameSoFar === '';
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows
      var storageName =
        isOnlyChild ? SEPARATOR + getComponentKey(children, 0) : nameSoFar;
      if (children == null || type === 'boolean') {
        // All of the above are perceived as null.
        callback(traverseContext, null, storageName, indexSoFar);
        subtreeCount = 1;
      } else if (type === 'string' || type === 'number' ||
                 ReactElement.isValidElement(children)) {
        callback(traverseContext, children, storageName, indexSoFar);
        subtreeCount = 1;
      } else if (type === 'object') {
        ("production" !== process.env.NODE_ENV ? invariant(
          !children || children.nodeType !== 1,
          'traverseAllChildren(...): Encountered an invalid child; DOM ' +
          'elements are not valid children of React components.'
        ) : invariant(!children || children.nodeType !== 1));
        for (var key in children) {
          if (children.hasOwnProperty(key)) {
            nextName = (
              nameSoFar + (nameSoFar ? SUBSEPARATOR : SEPARATOR) +
              wrapUserProvidedKey(key) + SUBSEPARATOR +
              getComponentKey(children[key], 0)
            );
            nextIndex = indexSoFar + subtreeCount;
            subtreeCount += traverseAllChildrenImpl(
              children[key],
              nextName,
              nextIndex,
              callback,
              traverseContext
            );
          }
        }
      }
    }
    return subtreeCount;
  };

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', 0, callback, traverseContext);
}

module.exports = traverseAllChildren;

}).call(this,require('_process'))
},{"./ReactElement":85,"./ReactInstanceHandles":93,"./invariant":160,"_process":28}],179:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule warning
 */

"use strict";

var emptyFunction = require("./emptyFunction");

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if ("production" !== process.env.NODE_ENV) {
  warning = function(condition, format ) {for (var args=[],$__0=2,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (!condition) {
      var argIndex = 0;
      console.warn('Warning: ' + format.replace(/%s/g, function()  {return args[argIndex++];}));
    }
  };
}

module.exports = warning;

}).call(this,require('_process'))
},{"./emptyFunction":141,"_process":28}],180:[function(require,module,exports){
module.exports = require('./lib/React');

},{"./lib/React":61}],181:[function(require,module,exports){
//     Underscore.js 1.8.2
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.2';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var isArrayLike = function(collection) {
    var length = collection && collection.length;
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, target, fromIndex) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    return _.indexOf(obj, target, typeof fromIndex == 'number' && fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = input && input.length; i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, 'length').length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = list && list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    var i = 0, length = array && array.length;
    if (typeof isSorted == 'number') {
      i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
    } else if (isSorted && length) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (item !== item) {
      return _.findIndex(slice.call(array, i), _.isNaN);
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    var idx = array ? array.length : 0;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    if (item !== item) {
      return _.findLastIndex(slice.call(array, 0, idx), _.isNaN);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = array != null && array.length;
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createIndexFinder(1);

  _.findLastIndex = createIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    
    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of 
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
  
  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}]},{},[1]);

var countryInput = document.getElementById('ajax2');
var countryList = document.getElementById('json-countrylist');
var languageInput = document.getElementById('ajax');
var languageList = document.getElementById('json-languagelist');
// Create a new XMLHttpRequest.

var autocomplete = function(list, input, source, message) {
  var request = new XMLHttpRequest();
  // Handle state changes for the request.
  request.onreadystatechange = function(response) {
    if (request.readyState === 4) {
      if (request.status === 200) {
        // Parse the JSON
        var jsonOptions = JSON.parse(request.responseText);

        // Loop over the JSON array.
        jsonOptions.forEach(function(item) {
          // Create a new <option> element.
          var option = document.createElement('option');
          // Set the value using the item in the JSON array.
          option.value = item;
          // Add the <option> element to the <datalist>.
          list.appendChild(option);
        });
      } else {
        // An error occured :(
        input.placeholder = "Couldn't load datalist options :(";
      }
    }
    // Update the placeholder text.
    // input.placeholder = message;
  };


  // Set up and make the request.
  // request.open('GET', 'html-elements.json', true);
  request.open('GET', source , true);
  request.send();
};

autocomplete(countryList, countryInput, 'html-countries.json', 'Search by Country');
autocomplete(languageList, languageInput, 'html-languages.json', 'Search by Language');
