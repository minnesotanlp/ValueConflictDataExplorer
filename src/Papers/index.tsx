import React, { useState, useEffect } from "react";
import { Grid, Card, Avatar, CardContent, CardMedia, Typography, Modal, Button, Backdrop, Fade, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Select, MenuItem, Paper, InputLabel} from "@material-ui/core";
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { Paper as TPaper, basePath } from "../index";
import { getAvatar } from "../SideBar";
import { useStyles } from "./style";
import { getAllTags } from '../index';
// import Questions from '../Questions';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Plot from 'react-plotly.js';


const COLORS = ['#9d7af0', '#f2eaa0', '#6e40db', '#edde51', "#450ad1", "#cfbb02"]

interface Props {
    papers: TPaper[];
    colors: string[];
    tags: Record<string, Record<string, boolean>>;
}


export function Papers(props: Props) {
    const { papers, colors, tags } = props;

    const [modalOpen, setModalOpen] = useState(false);
    const [currentPaper, setCurrentPaper] = useState<TPaper | null>(null);

    const classes = useStyles();
    // const onClickPaper = (paper: TPaper) => {
    //     window.open(
    //         paper.url || `https://www.google.com/search?q=${paper.name.replace(' ', '+')}`,
    //         "_blank")
    // }

    const onClickPaper = (paper: TPaper) => {
        setCurrentPaper(paper);
        setModalOpen(true);  
    };

    const closeModal = () => {
        setModalOpen(false);
        setCurrentPaper(null);  
    };

    const allTags = getAllTags();


    const getBgColor = (tag) => {
        const index = Object.keys(allTags).indexOf(tag)
        if (colors) {
            return colors[index]
        }
        return COLORS[index]
    }

    const hexToRGBA = (hex, alpha = 1) => {
        hex = hex.replace('#', '');
        const r = parseInt(hex.length === 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2), 16);
        const g = parseInt(hex.length === 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4), 16);
        const b = parseInt(hex.length === 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const AvatarComponent = ({ group, tag, bgcolor }) => {
        const avatarSrc = `${basePath}/assets/avatars/${group}_${tag}.png`;
        return (
            <Avatar alt={getAvatar(tag)} src={avatarSrc} style={{ width: 24, height: 24, backgroundColor: bgcolor, color: "white" }}><b style={{ fontSize: '0.75rem' }}>{getAvatar(tag)}</b></Avatar>
        );
    };

    const view_sankey = (currentPaper) => {
        if (!currentPaper) return null; 
    
        const data = [{
            type: "sankey",
            orientation: "h",
            node: {
                pad: 15,
                thickness: 20,
                line: {
                color: "black",
                width: 0.5
                },
                label: currentPaper.labels["one_d_labels"],
            },
            link: {
                source: currentPaper.sankey["source"],
                target: currentPaper.sankey["target"],
                value: currentPaper.sankey["value"],
                color: 'rgba(238, 235, 195, 0.5)'
            }
        }];
    
        const layout = {
            title: `Sankey Diagram: ${currentPaper.name}`,
            font: {
                size: 12
            },
        };
    
        return <Plot data={data} layout={layout} style={{ width: "100%", height: "100%" }} />;
    }


    const [displayText, setDisplayText] = useState({});

    const handleAnnotatorClick = (paper, number, index) => {
        // setCurrentPaper(paper);
        console.log("paper: ", paper);
        if (!paper) return null;

        const annotatorKey = `annotator${number}`;
        const annotatorData = paper[annotatorKey];

        if (!annotatorData) {
            console.log("Annotator data not found");
            return "Data not found";
        }
    
        const chain = Object.entries(annotatorData)
            // .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            // .map(([key, value]) => `${Array.isArray(value) ? value.join(', ') : value}`)
            // .join(' -> ');

            .map(([key, value]) => {
                const displayValue = Array.isArray(value) ? value.join(', ') : value;
                // return `<span style={{backgroundColor: 'yellow'}}>${displayValue}</span>`;
                // return `<span class="highlight">"${displayValue}"</span>`;
                return `<span style="background-color:rgb(247, 235, 173); box-shadow: 0px 2px 5px rgba(0,0,0,0.2); font-weight: bold; font-size: 16px">"${displayValue}"</span>`;
            })
            .join(' -> ');
        
        // console.log("chain: ", chain);
        // setDisplayText(chain);
        setDisplayText(prevTexts => ({...prevTexts, [index]: chain}));
    
        // return chain;
    }   


    return (
        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
                <Grid container justify="center" spacing={2}>
                    {papers.map((paper, i) => (
                        <Grid key={i} item>
                            <Card className={classes.card}>
                                <CardContent className={classes.cardContent} onClick={() => onClickPaper(paper)}>

                                    <Typography variant="subtitle1" component="p" className={classes.title}>
                                        {paper.name}
                                    </Typography>
                                    {/* <Typography className={classes.pos} color="textSecondary">
                                        {paper.venue} {paper.year}
                                    </Typography> */}
                                    
                                    {paper.others && Object.keys(paper.others).map((key, index) => (
                                        <Typography key={index} className={classes.pos} color="textSecondary">
                                            {key}: {paper.others[key]}
                                        </Typography>
                                    ))}

                                    {/* {paper.imagePath && paper.imagePath !== '' &&
                                        <CardMedia
                                            component="img"
                                            alt="Figure 1"
                                            className={classes.media}
                                            image={paper.imagePath}
                                        />} */}

                                    {/* <div className={classes.grow}> </div> */}
                                    <div className={classes.tags}>
                                        {Object.entries(allTags).map(([group, value]) => (
                                            <AvatarGroup key={group} className={classes.avatarGroup}>
                                                {paper[group]?.map((v) => {
                                                    return (
                                                        <div key={v} style={{
                                                            backgroundColor: getBgColor(group), 
                                                            height: 32,
                                                            fontSize: "14px",
                                                            textAlign: 'center', 
                                                            borderRadius: '16px', 
                                                            marginLeft: "-4px",
                                                            marginRight: "4px",
                                                            padding: '0 10px', 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'center', 
                                                            boxShadow: `0 1px 2px ${hexToRGBA(getBgColor(group), 10)}`,
                                                            color: '#ffffff'
                                                        }}>
                                                            {v}
                                                        </div>
                                                        
                                                    );
                                                })}
                                                
                                            </AvatarGroup>
                                        ))}
                                    </div>
                                    <div className={classes.buttonGroup}>
                                        <Button className={classes.button} onClick={(event) => {event.stopPropagation(); handleAnnotatorClick(paper, 1, i)}}>Annotator1</Button>
                                        <Button className={classes.button} onClick={(event) => {event.stopPropagation(); handleAnnotatorClick(paper, 2, i)}}>Annotator2</Button>
                                        <Button className={classes.button} onClick={(event) => {event.stopPropagation(); handleAnnotatorClick(paper, 3, i)}}>Annotator3</Button>
                                    </div>
                                    <div style={{ marginTop: '20px' }}>
                                        {/* {displayText[i]} */}
                                        <div dangerouslySetInnerHTML={{__html: displayText[i]}} />
                                    </div>
                                    {/* <div>
                                        {displayText[i] && displayText[i].map((element, idx) => (
                                            <React.Fragment key={idx}>
                                                {element}
                                                {idx < displayText[i].length - 1 && <span> -> </span>}
                                            </React.Fragment>
                                        ))}
                                    </div> */}



                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            {/* Question window*/}
            {/* {modalOpen && currentPaper && (
                <div className="modal">
                    <button onClick={closeModal}>Close</button>
                    <h1>{currentPaper.name}</h1>  
                </div>
            )} */}
            <Modal
                open={modalOpen}
                onClose={closeModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={modalOpen}>
                    <div className={classes.modal}>
                        <h1>Scenario: {currentPaper?.name}</h1>

                        {/* <Typography variant="h4">Scenario: {currentPaper?.name}</Typography> */}
                        {view_sankey(currentPaper)}


                        <Button onClick={closeModal} color="secondary">Close</Button>
                    </div>
                </Fade>
            </Modal>
        </Grid>

        
    );
}
