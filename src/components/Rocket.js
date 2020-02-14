/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
const isEmpty = require("lodash/isEmpty");
const uniq = require("lodash/uniqBy");
let allShips = [];
let fetched = false;
function Rocket(props) {
  let [ships, setShips] = useState([]);
  let [rocketDetails, setRocketDetails] = useState({});
  let [rocketOtherDetails, setRocketOtherDetails] = useState([]);
  let [launchSites, setLaunchSites] = useState([]);
  let [totalFlightsPastYear, setTotalFlightsPastYear] = useState(0);
  const rocketSingleInput = useRef(null);

  //get ships

  useEffect(() => {
    async function fetchData() {
      if (!allShips.length) {
        try {
          let res = await axios.get(
            "https://api.spacexdata.com/v3/ships?filter=ship_name,image,missions"
          );
          allShips = res.data;
        } catch (e) {
          allShips = [];
        }
      }
      //get rocket basic info
      fetched = false;
      axios
        .get(
          `https://api.spacexdata.com/v3/rockets/${props.match.params.id}?filter=height,diameter,mass,flickr_images,rocket_name`
        )
        .then(res => {
          fetched = true;
          setRocketDetails(res.data);
        })
        .catch(e => {
          fetched = true;
          setRocketDetails({});
          setShips([]);
        });

      //rocket other details
      axios
        .get(
          `https://api.spacexdata.com/v3/launches/past?rocket_id=${props.match.params.id}&&filter=mission_name,launch_date_local,launch_site/site_name`
        )
        .then(res => {
          let previousDate = new Date();
          const pastYear = previousDate.getFullYear() - 1;
          previousDate.setFullYear(pastYear);
          const currentDate = new Date();
          let flightCounter = 0;

          //get last 12 months flight count
          res.data.forEach(item => {
            if (
              previousDate < new Date(item.launch_date_local) &&
              currentDate > new Date(item.launch_date_local)
            ) {
              flightCounter++;
            }
          });

          //get unique launch site names
          const unique = uniq(res.data, "launch_site.site_name");
          setTotalFlightsPastYear(flightCounter);
          setLaunchSites(unique);
          setRocketOtherDetails(res.data);

          //getting filtered ships for each rocket
          let filteredShips = [];
          if (res.data.length) {
            allShips.forEach(ship => {
              ship.missions.length &&
                ship.missions.forEach(item => {
                  const shipFound = res.data.filter(
                    launched => launched.mission_name === item.name
                  );
                  if (shipFound.length) {
                    filteredShips.push(ship);
                  }
                });
            });
            const uniqueShips = uniq(filteredShips, "ship_name");
            setShips(uniqueShips);
          }
        })
        .catch(e => {
          setLaunchSites([]);
          setTotalFlightsPastYear(0);
          setRocketOtherDetails([]);
          setShips([]);
        });
    }
    fetchData();
    return () => {
      fetched = false;
    };
  }, [props.match.params]);

  function newROcketInfo(e) {
    e.preventDefault();
    props.history.push(`/rocket/${rocketSingleInput.current.value}`);
  }
  console.log(fetched, isEmpty(rocketDetails));
  return (
    <div>
      <div className="wrapper">
        {/* <!-- Header Start --> */}
        <header className="header">
          <div className="logo">
            <a href="#">
              <img src="/images/logo.png" />
            </a>
          </div>
        </header>
        {/* <!-- Header End --> */}

        {/* <!-- Banner Start --> */}
        {fetched ? (
          isEmpty(rocketDetails) ? (
            <p style={{ margin: 10 }}>No Rocket Found</p>
          ) : (
            <>
              <div
                className="rocket-banner"
                style={{
                  backgroundImage: isEmpty(rocketDetails)
                    ? ""
                    : `url("${rocketDetails.flickr_images[0]}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat"
                }}>
                <div className="rocket-strip">
                  <span className="rocket-name" data-testid="number-display">
                    {isEmpty(rocketDetails) ? "" : rocketDetails.rocket_name}
                  </span>
                </div>
              </div>

              <div className="content">
                <div className="content-conteiner">
                  <div className="rocket-detail">
                    <h2>
                      {isEmpty(rocketDetails) ? "" : rocketDetails.rocket_name}
                    </h2>
                    <ul>
                      <li className="detail-item">
                        <label>Height: </label>
                        <span>
                          {isEmpty(rocketDetails)
                            ? ""
                            : rocketDetails.height.meters + "m"}
                        </span>
                      </li>
                      <li className="detail-item">
                        <label>Diameter: </label>
                        <span>
                          {isEmpty(rocketDetails)
                            ? ""
                            : rocketDetails.diameter.meters + "m"}
                        </span>
                      </li>
                      <li className="detail-item">
                        <label>Mass: </label>
                        <span>
                          {isEmpty(rocketDetails)
                            ? ""
                            : rocketDetails.mass.kg + "kg"}
                        </span>
                      </li>
                      <li className="detail-item">
                        <label>Flights in the last 12 months: </label>
                        <span>{totalFlightsPastYear}</span>
                      </li>
                      <li className="detail-item">
                        <label>All missions completed: </label>
                        <span>
                          {rocketOtherDetails.length
                            ? rocketOtherDetails.map((item, key) => {
                                return item.mission_name + ", ";
                              }, this)
                            : null}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="launch-sites">
                    <h3>Launch sites</h3>
                    <ul>
                      {launchSites.length
                        ? launchSites.map((item, key) => {
                            return (
                              <li key={key}>- {item.launch_site.site_name}</li>
                            );
                          }, this)
                        : null}
                    </ul>
                  </div>

                  <div className="ships-list">
                    <h3>Ships</h3>
                    {ships.length
                      ? ships.map((item, key) => {
                          return (
                            <div key={key} className="ship-card">
                              <div className="ship-img">
                                <img src={item.image} />
                              </div>
                              <p>{item.ship_name}</p>
                            </div>
                          );
                        }, this)
                      : null}
                  </div>

                  <div className="other-rocket">
                    <div className="submit-rocket">
                      <form onSubmit={newROcketInfo}>
                        <label>Rocket ID</label>
                        <div className="form-row">
                          <input
                            type="text"
                            placeholder="Falcon9"
                            ref={rocketSingleInput}
                            required
                          />
                          <button type="submit">Submit</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        ) : (
          <p style={{ margin: 10 }}>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Rocket;
