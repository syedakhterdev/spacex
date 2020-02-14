import React, { useRef } from "react";

function Home(props) {
  const rocketInput = useRef(null);
  const displayRocketInfo = (e) => {
    e.preventDefault();
    props.history.push(`/rocket/${rocketInput.current.value}`);
  }
  return (
    <div className="wrapper">
      <header className="header">
        <div className="logo">
          <a href="#">
            <img src="/images/logo.png" alt="logo" />
          </a>
        </div>
      </header>
      {/* <!-- Header End --> */}

      {/* <!-- Banner Start --> */}
      <div className="landing-banner">
        <div className="banner-content">
          <h2>What's your favourite rocket?</h2>
        </div>
        <div className="submit-rocket">
          <form>
            <label>Rocket ID</label>
            <div className="form-row">
              <input
                type="text"
                ref={rocketInput}
                required
                placeholder="Falcon9"
                id="search-input"
              />
              <button type="button" id="submit-btn" onClick={displayRocketInfo}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
