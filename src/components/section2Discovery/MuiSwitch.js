import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

// import { ThemeProvider } from '@material-ui/styles';
// import { createMuiTheme } from '@material-ui/core/styles';

// const theme = createMuiTheme({
//     palette: {
//         primary: {
//             main: '#156ca6',
//         }
//     },
// });

export default function SwitchLabel(props) {
    const { label, checked, setChange, data } = props;
    const index = data.index;

    const handleChange = event => {
        let newAnswers = { ...data.answers };
        newAnswers.switches[index[0]][index[1]] = event.target.checked
        setChange(newAnswers)
    };

    return (
        <FormControlLabel style={{ height: 28 }}
            control={
                <Switch
                    key={index.join('')}
                    checked={checked}
                    onChange={handleChange}
                    color="primary"
                />
            }
            label={label}
        />
    );
}