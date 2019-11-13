import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';

const ExpansionPanel = withStyles({
  root: {
    backgroundColor: "transparent",
    width: "66%",
    boxShadow: "none",
    marginLeft: "128px",
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      marginLeft: "128px"
    }
  },
  expanded: {}
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    minHeight: 10,
    padding: 0,
    "&$expanded": {
      minHeight: 10,
      margin: 0
    }
  },
  content: {
    "&$expanded": {
      minHeight: 10,
      margin: 0
    }
  },
  expanded: {
    minHeight: 10,
    margin: 0 
  }
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: '0 0 10px 0'
  }
}))(MuiExpansionPanelDetails);

export default function CustomizedExpansionPanels(props) {
  const [expanded, setExpanded] = React.useState("");
  
  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div>
      <ExpansionPanel
        square
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <ExpansionPanelSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
        >
          <InfoRoundedIcon color="action"/>&nbsp;
          <Typography>More info</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>{props.info}</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}