import React, { useState, useEffect} from "react";
import {
    Typography,
    Toolbar,
    IconButton,
    AppBar,
    Badge,
    InputBase,
    Modal,
    Box,
    Checkbox,
    FormControlLabel, 
    Button
} from "@material-ui/core";
import {
    // AccountCircle,
    // Notifications as NotificationsIcon,
    // Mail as MailIcon,
    Menu as MenuIcon,
    // Search as SearchIcon,
    CloudUpload,
    Announcement,
    Description,
    Home
} from "@material-ui/icons";

import { useStyles } from "./style";

interface Props {
    title: string;
    preprint: string;
    github: string;
    topTheme: string;
    handleDrawerToggle: () => void;
    onProfileMenuOpen: (e: React.MouseEvent<HTMLElement>) => void;
}

const topThemeBackground = (theme) => {
    if (/^#([0-9A-F]{3}){1,2}$/i.test(theme) || /^rgb/i.test(theme)) {
      // If topTheme is a color (hex or rgb)
      return { backgroundColor: theme };
    } else {
      // If topTheme is an image url
      return { backgroundImage: `url(${theme})`, backgroundSize: 'cover' };
    }
};

export function TopBar(props: Props) {
    const classes = useStyles();
    const { title, preprint, github, topTheme, onProfileMenuOpen, handleDrawerToggle } = props;

    const [modalOpen, setModalOpen] = useState(false); // Modal opens by default every time     '''change back to false later if needed'''
    const [isChecked, setIsChecked] = useState(false);

    // // Load the checkbox state from localStorage to determine if it should be shown
    // useEffect(() => {
    //     const instructionSeen = localStorage.getItem('instructionSeen') === 'true';
    //     setIsChecked(instructionSeen);
    // }, []);

    // const handleModalClose = () => {
    //     setModalOpen(false);
    // };

    // const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     localStorage.setItem('instructionSeen', 'true');
    //     setIsChecked(event.target.checked);
    // };

    const handleModalClose = () => {
        if (isChecked) {
            setModalOpen(false);
        }
        // setModalOpen(false);
    };

    const handleCheckboxChange = (event) => {
        // setIsChecked(event.target.checked);
        // if (event.target.checked) {
        //     // Optionally close the modal when the checkbox is checked
        //     setModalOpen(false);
        // }
        setIsChecked(event.target.checked);
    };

    // Prevent the modal from closing if the checkbox is not checked
    const handleBackdropClick = (event, reason) => {
        // // Do nothing if the checkbox is not checked
        // if (!isChecked) {
        //     event.preventDefault();
        //     return;
        // }
        // // Otherwise, allow the modal to close
        // setModalOpen(false);   // comment/uncomment later
        if (reason === 'backdropClick' && !isChecked) {
            event.preventDefault();
        } else {
            handleModalClose();
        }
    };

    return (
        <React.Fragment>
            <AppBar position="fixed" className={classes.appBar} style={topThemeBackground(topTheme)}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap className={classes.title}>
                        {title}
                    </Typography>

                    <div className={classes.sectionDesktop}>
                        <IconButton
                            edge="end"
                            aria-label="link to instruction page"
                            aria-haspopup="true"
                            onClick={() => setModalOpen(true)}    
                            color="inherit" 
                            disabled={!github}
                        >
                            <Announcement /> <span style={{ fontSize: '12px' }} className={classes.iconName}>{' '}Instruction </span>
                        </IconButton>

                        <IconButton
                            edge="end"
                            aria-label="link to arxiv paper"
                            aria-haspopup="true"
                            onClick={() => window.open(preprint)}
                            color="inherit"
                            disabled={!preprint}
                        >
                            <Description /> <span style={{ fontSize: '12px' }} className={classes.iconName}>{' '}Preprint </span>
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="link to github homepage"
                            aria-haspopup="true"
                            onClick={() => window.open(github)}
                            color="inherit"
                            disabled={!github}
                        >
                            <Home /> <span style={{ fontSize: '12px' }} className={classes.iconName}>{' '}Homepage </span>
                        </IconButton>

                    </div>
                </Toolbar>
            </AppBar>

            <Modal
                open={modalOpen}
                onClose={handleBackdropClick}
                aria-labelledby="instruction-modal-title"
                aria-describedby="instruction-modal-description"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Box className={classes.instructionModal} 
                    // style={{
                        // position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        // width: 400, bgcolor: 'background.paper', border: '2px solid #000',
                        // boxShadow: 24, p: 4,
                    // }}
                >
                    <Typography id="instruction-modal-title" variant="h6" component="h2">
                        *Instructions
                    </Typography>
                    <Typography id="instruction-modal-description">
                        <ul>
                            <li>We are interested in understanding how humans resolve internal conflicts and how human values play a role in conflict resolution.</li>
                            <li>Please read the instructions and click on the checkbox.</li>
                            <li>You will see the annotations by 3 annotators, including some follow-up insights related to the scenario itself and the primary conflicting pair.</li>
                            <li><strong>Click on each scenario to view a detailed Sankey diagram, which visually represents the flow and relationships between the conflicting human values identified in the scenario.</strong></li>
                            <li>Everything underlined throughout the survey can be hovered over to see detailed explanations.</li>
                        </ul>
                        {/* <Typography component="div" style={{ fontWeight: 'bold' }}>
                            PLEASE DO NOT USE CHATGPT OR OTHER SIMILAR AI TOOLS TO DO THE TASK WE WILL DISQUALIFY YOUR ANSWER
                        </Typography> */}
                    </Typography>
                    <FormControlLabel
                        control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                        label="I have read and understood the detailed instructions."
                    />
                    <Button onClick={handleModalClose} color="primary">
                        Close
                    </Button>
                </Box>
            </Modal>
        </React.Fragment>
    );
}
