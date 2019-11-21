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
    boxShadow: "none",
    width: 600,
    marginLeft: 8,
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      marginLeft: 8,
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
    padding: '0 0 8px 0'
  }
}))(MuiExpansionPanelDetails);

export default function CustomizedExpansionPanels(props) {
  const [expanded, setExpanded] = React.useState("");
  
  const handleChange = toggle => (event, newExpanded) => {
    setExpanded(newExpanded ? toggle : false);
  };

  return (
    <div>
      <ExpansionPanel
        square
        expanded={expanded === "toggle"}
        onChange={handleChange("toggle")}
      >
        <ExpansionPanelSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
        >
          <InfoRoundedIcon style={{marginLeft: -4}} color="action"/>&nbsp;
          <Typography>More info</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {/* TODO: sync style */}
          <Typography>{props.info}</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}