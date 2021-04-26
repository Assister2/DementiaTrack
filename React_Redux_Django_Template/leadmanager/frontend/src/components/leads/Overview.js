import React, { Component } from "react";
import Repository from "../../../backend-connection/repository";
import "../../../stylesheets/Overview.css";
import DetermineUTI from "../../../backend-connection/DetermineUTI";
import daysjs from "dayjs";
import DetermineDA from "../../../backend-connection/determineDA";

export class Overview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      analysisTime: null,
      analysis: "Please analyze to see results.",
      utiDetermination: null,
      utiFlag: "",
      bathroomOverTime: [0, 0, 0, 0, 0],
      tempOverTime: [0, 0, 0, 0, 0],
      DAFlag: "",
      dailyOverTime: [0, 0, 0, 0, 0],
      daColors: [],
      sleepDetermination: "Please analyze to see results.",
      sleepFlag: "",
      sleepPercent: [],
      sleepWake: [],
      moveDetermination: null,
      moveFlag: "",

      novPacingPer: "",
      novLappingPer: "",
      novDirectPer: "",
      novRandomPer: "",

      decPacingPer: "",
      decLappingPer: "",
      decDirectPer: "",
      decRandomPer: "",

      janPacingPer: "",
      janLappingPer: "",
      janDirectPer: "",
      janRandomPer: "",

      febPacingPer: "",
      febLappingPer: "",
      febDirectPer: "",
      febRandomPer: "",

      marPacingPer: "",
      marLappingPer: "",
      marDirectPer: "",
      marRandomPer: "",
    };
  }

  clicked = async () => {
    let sleepFlag = await this.updateSleep();
    let utiFlag = await this.updateUTI();
    let DAFlag = await this.updateDA();
    let moveFlag = await this.updateMovement();

    await this.sendNotification(utiFlag, sleepFlag, DAFlag, moveFlag);
  };

  sendNotification = async (utiFlag, sleepFlag, DAFlag, moveFlag) => {
    let totalFlagged = 0;

    if (utiFlag == "red" || utiFlag == "yellow") totalFlagged++;
    if (sleepFlag == "red" || sleepFlag == "yellow") totalFlagged++;
    if (DAFlag == "red" || DAFlag == "yellow") totalFlagged++;
    if (moveFlag == "red" || moveFlag == "yellow") totalFlagged++;

    let resultText = "No irregularities were found.";
    let heading = "";

    if (
      utiFlag == "yellow" ||
      sleepFlag == "yellow" ||
      DAFlag == "yellow" ||
      moveFlag == "yellow"
    ) {
      resultText = "Some irregularities were found.";
      heading = "<b>Notice: </b>";
    } else if (
      utiFlag == "red" ||
      sleepFlag == "red" ||
      DAFlag == "red" ||
      moveFlag == "red"
    ) {
      resultText = "Severe irregularities were found.";
      heading = "<b>Warning: </b>";
    }

    this.setState({
      analysisTime: "Last five months",
      analysis: resultText,
    });

    if (totalFlagged >= 2) {
      let message = `
      <h1 style='text-align: center'>Alert From DementiaTrack</h1>
      <p style='text-align: center'> ${heading} ${resultText}
      </p>
      <p style='text-align: center'>Time Range: ${this.state.analysisTime}</p>
      <br />
      <div style='background-color: lightgray;border-radius:5px;padding:10px; text-align: center;margin: 20px'>
          <h3>UTI</h3>
          <table border='1' style='margin:0 auto; border-color: #6699cc' width='500px'>
              <tr>
                  <th>Month</th>
                  <th>Bathroom Trip Anomalies</th>
                  <th>Body Temperature Anomalies</th>
              </tr>
              <tr style='text-align: center; background-color: white'>
                  <td>November</td>
                  <td>${this.state.bathroomOverTime[0]}</td>
                  <td>${this.state.tempOverTime[0]}</td>
              </tr>
              <tr style='text-align: center'>
                  <td>December</td>
                  <td>${this.state.bathroomOverTime[1]}</td>
                  <td>${this.state.tempOverTime[1]}</td>
              </tr>
              <tr style='text-align: center; background-color: white'>
                  <td>January</td>
                  <td>${this.state.bathroomOverTime[2]}</td>
                  <td>${this.state.tempOverTime[2]}</td>
              </tr>
              <tr style='text-align: center'>
                  <td>February</td>
                  <td>${this.state.bathroomOverTime[3]}</td>
                  <td>${this.state.tempOverTime[3]}</td>
              </tr>
              <tr style='text-align: center; background-color: white'>
                  <td>March</td>
                  <td>${this.state.bathroomOverTime[4]}</td>
                  <td>${this.state.tempOverTime[4]}</td>
              </tr>
          </table>
          <br />
      </div>
      <div style='background-color: lightgray;border-radius:5px;padding:10px; text-align: center;margin: 20px'>
          <h3>Daily Activities</h3>
          <table border='1' style='margin:0 auto; border-color: #6699cc' width='500px'>
              <tr>
                  <th>Month</th>
                  <th>Bathroom Trip Anomalies</th>
              </tr>
              <tr style='text-align: center; background-color: white'>
                  <td>November</td>
                  <td>${this.state.dailyOverTime[0]}</td>
              </tr>
              <tr style='text-align: center'>
                  <td>December</td>
                  <td>${this.state.dailyOverTime[1]}</td>
              </tr>
              <tr style='text-align: center; background-color: white'>
                  <td>January</td>
                  <td>${this.state.dailyOverTime[2]}</td>
              </tr>
              <tr style='text-align: center'>
                  <td>February</td>
                  <td>${this.state.dailyOverTime[3]}</td>
              </tr>
              <tr style='text-align: center; background-color: white'>
                  <td>March</td>
                  <td>${this.state.dailyOverTime[4]}</td>
              </tr>
          </table>
          <br />
      </div>
      <div style='background-color: lightgray;border-radius:5px;padding:10px; text-align: center;margin: 20px'>
          <h3>Sleep</h3>
          <table border='1' style='margin:0 auto; border-color: #6699cc' width='500px'>
              <tr style='text-align: center'>
                  <th>Month</th>
                  <th>Percent Time Asleep</th>
                  <th>Number of Wake Bouts</th>
              </tr>
              <tr style='text-align: center; background-color: white'>
                  <td>November</td>
                  <td> ${this.state.sleepPercent[0]}%</td>
                  <td> ${this.state.sleepWake[0]}</td>
              </tr>
              <tr style='text-align: center'>
                  <td>December</td>
                  <td> ${this.state.sleepPercent[1]}%</td>
                  <td> ${this.state.sleepWake[1]}</td>
              </tr>
              <tr style='text-align: center; background-color: white'>
                  <td>January</td>
                  <td> ${this.state.sleepPercent[2]}%</td>
                  <td> ${this.state.sleepWake[2]}</td>
              </tr>
              <tr style='text-align: center'>
                  <td>February</td>
                  <td> ${this.state.sleepPercent[3]}%</td>
                  <td> ${this.state.sleepWake[3]}</td>
              </tr>
              <tr style='text-align: center; background-color: white'>
                  <td>March</td>
                  <td> ${this.state.sleepPercent[4]}%</td>
                  <td> ${this.state.sleepWake[4]}</td>
              </tr>
          </table>
          <br />
      </div>
      <div style='background-color: lightgray;border-radius:5px;padding:10px; text-align: center;margin: 20px'>
          <h3>Movement</h3>
          <table border='1' style='margin:0 auto; border-color: #6699cc'  width='500px'>
              <tr>
                  <th>Month</th>
                  <th>Pacing</th>
                  <th>Lapping</th>
                  <th>Direct</th>
                  <th>Random</th>
              </tr>
              <tr style='background-color: white'>
                  <td>November</td>
                  <td> ${this.state.novPacingPer} </td>
                  <td> ${this.state.novLappingPer} </td>
                  <td> ${this.state.novDirectPer} </td>
                  <td> ${this.state.novRandomPer} </td>
              </tr>
              <tr>
                  <td>December</td>
                  <td> ${this.state.decPacingPer} </td>
                  <td> ${this.state.decLappingPer} </td>
                  <td> ${this.state.decDirectPer} </td>
                  <td> ${this.state.decRandomPer} </td>
              </tr>
              <tr style='background-color: white'>
                  <td>January</td>
                  <td> ${this.state.janPacingPer} </td>
                  <td> ${this.state.janLappingPer} </td>
                  <td> ${this.state.janDirectPer} </td>
                  <td> ${this.state.janRandomPer} </td>
              </tr>
              <tr>
                  <td>February</td>
                  <td> ${this.state.febPacingPer} </td>
                  <td> ${this.state.febLappingPer} </td>
                  <td> ${this.state.febDirectPer} </td>
                  <td> ${this.state.febRandomPer} </td>
              </tr>
              <tr style='background-color: white'>
                  <td>March</td>
                  <td> ${this.state.marPacingPer} </td>
                  <td> ${this.state.marLappingPer} </td>
                  <td> ${this.state.marDirectPer} </td>
                  <td> ${this.state.marRandomPer} </td>
              </tr>
          </table>
          <br />
      </div>
      <p style='text-align: center'><i>Please visit the website for more information.</i></p>`;

      let repo = new Repository();
      await repo.sendEmail(message);
    }
  };

  updateUTI = async () => {
    let flag;

    let repo = new Repository();

    let dataTypeToRun = document.getElementById("dropdown").value;

    let response = await repo.GetUTIAnomalies(dataTypeToRun);

    let det = new DetermineUTI();
    let result = det.getDetermination(
      response.BathroomAnomalies,
      response.TempAnomalies,
      30,
      response.StartDate
    );

    this.setState({
      utiDetermination: result.Determination,
      utiFlag: result.OverallColor,
      bathroomOverTime: result.BathroomOverTime,
      tempOverTime: result.TempOverTime,
    });

    return flag;
  };

  updateDA = async () => {
    let flag;

    let repo = new Repository();

    let dataTypeToRun = document.getElementById("dropdown").value;

    if (dataTypeToRun == "Normal") {
      let response = await repo.GetDAAr();

      let det = new DetermineDA();
      let result = det.getDetermination(
        response.Anomalies,
        99,
        response.StartDate
      );

      if (
        result.Determination ==
        "The values for Daily Activities are too random."
      ) {
        flag = "yellow";
      } else if (
        result.Determination ==
        "We detected several days of anomalous Daily Activities."
      ) {
        flag = "red";
      } else {
        flag = "green";
      }

      // {console.log(this.props.dailyOverTime)}
      // {console.log(result.DAOverTime)}

      this.setState({
        DADetermination: result.Determination,
        DAFlag: flag,
        daColors: result.Colors,
        dailyOverTime: result.DAOverTime,
      });
    } else if (dataTypeToRun == "Abnormal") {
      let response = await repo.GetDAMi();

      let det = new DetermineDA();
      let result = det.getDetermination(
        response.Anomalies,
        83,
        response.StartDate
      );

      if (
        result.Determination ==
        "The values for Daily Activities are too random."
      ) {
        flag = "yellow";
      } else if (
        result.Determination ==
        "We detected several days of anomalous Daily Activities."
      ) {
        flag = "red";
      } else {
        flag = "green";
      }

      this.setState({
        DADetermination: result.Determination,
        DAFlag: flag,
        daColors: result.Colors,
        dailyOverTime: result.DAOverTime,
      });
    } else if (dataTypeToRun == "Random") {
      let response = await repo.GetDARa();

      let det = new DetermineDA();
      let result = det.getDetermination(
        response.Anomalies,
        99,
        response.StartDate
      );

      if (
        result.Determination ==
        "The values for Daily Activities are too random."
      ) {
        flag = "yellow";
      } else if (
        result.Determination ==
        "We detected several days of anomalous Daily Activities."
      ) {
        flag = "red";
      } else {
        flag = "green";
      }

      this.setState({
        DADetermination: result.Determination,
        DAFlag: flag,
        daColors: result.Colors,
        dailyOverTime: result.DAOverTime,
      });
    }
  };

  updateSleep = async () => {
    let flag;

    let repo = new Repository();

    let dataTypeToRun = document.getElementById("dropdown").value;

    let response = await repo.GetSleepSelect(dataTypeToRun);

    flag = response.Color;
    let det = "";
    if (response.Color == "green") {
      det = "Sleep Results are acceptable.";
    } else if (response.Color == "red") {
      det =
        "Sleep Results are not acceptable please check sleep page for more details.";
    } else if (response.Color == "yellow") {
      det = "Sleep Results are inconclusive.";
    } else {
      det = "error";
    }

    this.setState({
      sleepPercent: response.Percent_Anomalies,
      sleepWake: response.Wake_Anomalies,
      sleepDetermination: det,
      sleepFlag: response.Color,
    });

    return flag;
  };

  updateMovement = async () => {
    let flag;
    let moveDetermination;
    let repo = new Repository();
    let dataTypeToRun = document.getElementById("dropdown").value;
    let responseMove = await repo.GetLocationOccurences(dataTypeToRun);

    let pacing = parseFloat(responseMove.Pacing);
    let lapping = parseFloat(responseMove.Lapping);
    let direct = parseFloat(responseMove.Direct);
    let Random = parseFloat(responseMove.Random);

    let pacingAndlapping = pacing + lapping;

    if (pacingAndlapping >= 50) {
      flag = "red";
      moveDetermination = "Severe movement irregularities were present.";
    } else if (Random >= 60) {
      flag = "yellow";
      moveDetermination = "Irregular movements found but not severe.";
    } else {
      flag = "green";
      moveDetermination = "No abnormal movement to be found.";
    }

    //Get access to the prop. set it to a variable. Check the variables content.
    //if it is greater than said number. change props color of text?

    this.setState({
      moveFlag: flag,
      moveDetermination: moveDetermination,

      novPacingPer: responseMove.novPacingPer,
      novLappingPer: responseMove.novLappingPer,
      novDirectPer: responseMove.novDirectPer,
      novRandomPer: responseMove.novRandomPer,

      decPacingPer: responseMove.decPacingPer,
      decLappingPer: responseMove.decLappingPer,
      decDirectPer: responseMove.decDirectPer,
      decRandomPer: responseMove.decRandomPer,

      janPacingPer: responseMove.janPacingPer,
      janLappingPer: responseMove.janLappingPer,
      janDirectPer: responseMove.janDirectPer,
      janRandomPer: responseMove.janRandomPer,

      febPacingPer: responseMove.febPacingPer,
      febLappingPer: responseMove.febLappingPer,
      febDirectPer: responseMove.febDirectPer,
      febRandomPer: responseMove.febRandomPer,

      marPacingPer: responseMove.marPacingPer,
      marLappingPer: responseMove.marLappingPer,
      marDirectPer: responseMove.marDirectPer,
      marRandomPer: responseMove.marRandomPer,
    });

    return flag;
  };

  render() {
    return (
      <div>
        <h1 id="title">Overview</h1>
        <Summary
          analysis={this.state.analysis}
          time={this.state.analysisTime}
          daColors={this.state.daColors}
        />
        <Analyzer clicked={this.clicked} />
        <UTI
          determination={this.state.utiDetermination}
          flag={this.state.utiFlag}
          bathroomOverTime={this.state.bathroomOverTime}
          tempOverTime={this.state.tempOverTime}
        />
        <DA
          determination={this.state.DADetermination}
          flag={this.state.DAFlag}
          dailyOverTime={this.state.dailyOverTime}
          colors={this.state.daColors}
        />
        <Sleep
          determination={this.state.sleepDetermination}
          flag={this.state.sleepFlag}
          percent={this.state.sleepPercent}
          wake={this.state.sleepWake}
        />
        <MOVE
          determination={this.state.moveDetermination}
          flag={this.state.moveFlag}
          novPacingPer={this.state.novPacingPer}
          novLappingPer={this.state.novLappingPer}
          novDirectPer={this.state.novDirectPer}
          novRandomPer={this.state.novRandomPer}
          decPacingPer={this.state.decPacingPer}
          decLappingPer={this.state.decLappingPer}
          decDirectPer={this.state.decDirectPer}
          decRandomPer={this.state.decRandomPer}
          janPacingPer={this.state.janPacingPer}
          janLappingPer={this.state.janLappingPer}
          janDirectPer={this.state.janDirectPer}
          janRandomPer={this.state.janRandomPer}
          febPacingPer={this.state.febPacingPer}
          febLappingPer={this.state.febLappingPer}
          febDirectPer={this.state.febDirectPer}
          febRandomPer={this.state.febRandomPer}
          marPacingPer={this.state.marPacingPer}
          marLappingPer={this.state.marLappingPer}
          marDirectPer={this.state.marDirectPer}
          marRandomPer={this.state.marRandomPer}
        />
      </div>
    );
  }
}

class Summary extends React.Component {
  render() {
    return (
      <div id="overview">
        <h3>Summary</h3>
        <hr style={{ backgroundColor: "#6699CC", borderWidth: "2px" }} />
        <p>{this.props.analysis}</p>
        {this.props.time != null && <p>Time Range: {this.props.time}</p>}
        <p>{this.props.result}</p>
      </div>
    );
  }
}

class Analyzer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="overview">
        <h3>Analyze</h3>
        <hr style={{ backgroundColor: "#6699CC", borderWidth: "2px" }} />
        <select id="dropdown">
          <option value="Normal">Normal</option>
          <option value="Abnormal">Abnormal</option>
          <option value="Random">Random</option>
        </select>
        <br />
        <button onClick={this.props.clicked} className="button">
          {"Run"}
        </button>
      </div>
    );
  }
}

class UTI extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="overview">
        <div className="overviewSymptom">
          <div>
            {this.props.flag == "" && (
              <span className="dot" style={{ backgroundColor: "white" }} />
            )}

            {this.props.flag == "red" && (
              <span
                className="dot"
                style={{ backgroundColor: "rgb(249, 21, 47)" }}
              />
            )}

            {this.props.flag == "yellow" && (
              <span
                className="dot"
                style={{ backgroundColor: "rgb(250, 219, 1)" }}
              />
            )}

            {this.props.flag == "green" && (
              <span
                className="dot"
                style={{ backgroundColor: "rgb(39, 232, 51)" }}
              />
            )}
          </div>
          <div className="overviewSymptomTextContainer">
            <h3>UTI</h3>

            {this.props.determination == null && (
              <p>Please analyze to see results.</p>
            )}

            {this.props.determination != null && (
              <p>{this.props.determination}</p>
            )}

            <table className="overviewTable">
              <tr>
                <th>Month</th>
                <th>Bathroom Trip Anomalies</th>
                <th>Body Temperature Anomalies</th>
              </tr>
              <tr>
                <td>November</td>
                {this.props.bathroomOverTime[0] == 0 ? (
                  <td>{this.props.bathroomOverTime[0]}</td>
                ) : (
                  <td className="redTableCell">
                    {this.props.bathroomOverTime[0]}
                  </td>
                )}
                {this.props.tempOverTime[0] == 0 ? (
                  <td>{this.props.tempOverTime[0]}</td>
                ) : (
                  <td className="redTableCell">{this.props.tempOverTime[0]}</td>
                )}
              </tr>
              <tr>
                <td>December</td>
                {this.props.bathroomOverTime[1] == 0 ? (
                  <td>{this.props.bathroomOverTime[1]}</td>
                ) : (
                  <td className="redTableCell">
                    {this.props.bathroomOverTime[1]}
                  </td>
                )}
                {this.props.tempOverTime[1] == 0 ? (
                  <td>{this.props.tempOverTime[1]}</td>
                ) : (
                  <td className="redTableCell">{this.props.tempOverTime[1]}</td>
                )}
              </tr>
              <tr>
                <td>January</td>
                {this.props.bathroomOverTime[2] == 0 ? (
                  <td>{this.props.bathroomOverTime[2]}</td>
                ) : (
                  <td className="redTableCell">
                    {this.props.bathroomOverTime[2]}
                  </td>
                )}
                {this.props.tempOverTime[2] == 0 ? (
                  <td>{this.props.tempOverTime[2]}</td>
                ) : (
                  <td className="redTableCell">{this.props.tempOverTime[2]}</td>
                )}
              </tr>
              <tr>
                <td>February</td>
                {this.props.bathroomOverTime[3] == 0 ? (
                  <td>{this.props.bathroomOverTime[3]}</td>
                ) : (
                  <td className="redTableCell">
                    {this.props.bathroomOverTime[3]}
                  </td>
                )}
                {this.props.tempOverTime[3] == 0 ? (
                  <td>{this.props.tempOverTime[3]}</td>
                ) : (
                  <td className="redTableCell">{this.props.tempOverTime[3]}</td>
                )}
              </tr>
              <tr>
                <td>March</td>
                {this.props.bathroomOverTime[4] == 0 ? (
                  <td>{this.props.bathroomOverTime[4]}</td>
                ) : (
                  <td className="redTableCell">
                    {this.props.bathroomOverTime[4]}
                  </td>
                )}
                {this.props.tempOverTime[4] == 0 ? (
                  <td>{this.props.tempOverTime[4]}</td>
                ) : (
                  <td className="redTableCell">{this.props.tempOverTime[4]}</td>
                )}
              </tr>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

class Sleep extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="overview">
        <div className="overviewSymptom">
          {this.props.flag == "" && (
            <span className="dot" style={{ backgroundColor: "white" }} />
          )}

          {this.props.flag == "red" && (
            <span
              className="dot"
              style={{ backgroundColor: "rgb(249, 21, 47)" }}
            />
          )}

          {this.props.flag == "yellow" && (
            <span
              className="dot"
              style={{ backgroundColor: "rgb(250, 219, 1)" }}
            />
          )}

          {this.props.flag == "green" && (
            <span
              className="dot"
              style={{ backgroundColor: "rgb(39, 232, 51)" }}
            />
          )}

          <div className="overviewSymptomTextContainer">
            <h3>Sleep</h3>

            {this.props.determination == null && (
              <p>Please analyze to see results.</p>
            )}

            {this.props.determination && <p>{this.props.determination}</p>}
          </div>
        </div>
        <div>
          <table className="overviewTable">
            <tr>
              <th>Month</th>
              <th>Percent Time Asleep</th>
              <th>Number of Wake Bouts</th>
            </tr>
            <tr>
              <td>November</td>
              <td> {this.props.percent[0]}%</td>
              <td> {this.props.wake[0]}</td>
            </tr>
            <tr>
              <td>December</td>
              <td> {this.props.percent[1]}%</td>
              <td> {this.props.wake[1]}</td>
            </tr>
            <tr>
              <td>January</td>
              <td> {this.props.percent[2]}%</td>
              <td> {this.props.wake[2]}</td>
            </tr>
            <tr>
              <td>February</td>
              <td> {this.props.percent[3]}%</td>
              <td> {this.props.wake[3]}</td>
            </tr>
            <tr>
              <td>March</td>
              <td> {this.props.percent[4]}%</td>
              <td> {this.props.wake[4]}</td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}

class DA extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="overview">
        <div className="overviewSymptom">
          <div>
            {this.props.flag == "" && (
              <span className="dot" style={{ backgroundColor: "white" }} />
            )}

            {this.props.flag != "" && (
              <span
                className="dot"
                style={{ backgroundColor: this.props.colors, margin: "10px" }}
              />
            )}
          </div>

          <div className="overviewSymptomTextContainer">
            <h3>Daily Activity</h3>

            {this.props.determination == null && (
              <p>Please analyze to see results.</p>
            )}

            {this.props.determination && <p>{this.props.determination}</p>}
            
            <table className="overviewTable">
              <tr>
                <th>Month</th>
                <th>Anomalies</th>
              </tr>
              <tr>
                <td>November</td>
                {this.props.dailyOverTime[0] == 0 ? (
                  <td>{this.props.dailyOverTime[0]}</td>
                ) : (
                  <td className="redTableCell">
                    {this.props.dailyOverTime[0]}
                  </td>
                )}
              </tr>
              <tr>
                <td>December</td>
                {this.props.dailyOverTime[1] == 0 ? (
                  <td>{this.props.dailyOverTime[1]}</td>
                ) : (
                  <td className="redTableCell">
                    {this.props.dailyOverTime[1]}
                  </td>
                )}
              </tr>
              <tr>
                <td>January</td>
                {this.props.dailyOverTime[2] == 0 ? (
                  <td>{this.props.dailyOverTime[2]}</td>
                ) : (
                  <td className="redTableCell">
                    {this.props.dailyOverTime[2]}
                  </td>
                )}
              </tr>
              <tr>
                <td>February</td>
                {this.props.dailyOverTime[3] == 0 ? (
                  <td>{this.props.dailyOverTime[3]}</td>
                ) : (
                  <td className="redTableCell">
                    {this.props.dailyOverTime[3]}
                  </td>
                )}
              </tr>
              <tr>
                <td>March</td>
                {this.props.dailyOverTime[4] == 0 ? (
                  <td>{this.props.dailyOverTime[4]}</td>
                ) : (
                  <td className="redTableCell">
                    {this.props.dailyOverTime[4]}
                  </td>
                )}
              </tr>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

class MOVE extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="overview">
        <div className="overviewSymptom">
          {this.props.flag == "" && (
            <span className="dot" style={{ backgroundColor: "white" }} />
          )}

          {this.props.flag == "red" && (
            <span
              className="dot"
              style={{ backgroundColor: "rgb(249, 21, 47)" }}
            />
          )}

          {this.props.flag == "yellow" && (
            <span
              className="dot"
              style={{ backgroundColor: "rgb(250, 219, 1)" }}
            />
          )}

          {this.props.flag == "green" && (
            <span
              className="dot"
              style={{ backgroundColor: "rgb(39, 232, 51)" }}
            />
          )}

          <div className="overviewSymptomTextContainer">
            <h3>Movement</h3>

            {this.props.determination == null && (
              <p>Please analyze to see results.</p>
            )}

            {this.props.determination && <p>{this.props.determination}</p>}
          </div>
        </div>
        <div>
          <table className="overviewTable">
            <tr>
              <th>Month</th>
              <th>Pacing</th>
              <th>Lapping</th>
              <th>Direct</th>
              <th>Random</th>
            </tr>
            <tr>
              <td>November</td>
              <td> {this.props.novPacingPer}%</td>
              <td> {this.props.novLappingPer}%</td>
              <td> {this.props.novDirectPer}%</td>
              <td> {this.props.novRandomPer}%</td>
            </tr>
            <tr>
              <td>December</td>
              <td> {this.props.decPacingPer}%</td>
              <td> {this.props.decLappingPer}%</td>
              <td> {this.props.decDirectPer}%</td>
              <td> {this.props.decRandomPer}%</td>
            </tr>
            <tr>
              <td>January</td>
              <td> {this.props.janPacingPer}%</td>
              <td> {this.props.janLappingPer}%</td>
              <td> {this.props.janDirectPer}%</td>
              <td> {this.props.janRandomPer}%</td>
            </tr>
            <tr>
              <td>February</td>
              <td> {this.props.febPacingPer}%</td>
              <td> {this.props.febLappingPer}%</td>
              <td> {this.props.febDirectPer}%</td>
              <td> {this.props.febRandomPer}%</td>
            </tr>
            <tr>
              <td>March</td>
              <td> {this.props.marPacingPer}%</td>
              <td> {this.props.marLappingPer}%</td>
              <td> {this.props.marDirectPer}%</td>
              <td> {this.props.marRandomPer}%</td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}

export default Overview;
