import React, { useState, useEffect } from "react";
import { Grid, Card, Avatar, CardContent, CardMedia, Typography, Modal, Button, Backdrop, Fade, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Select, MenuItem, Paper, InputLabel} from "@material-ui/core";
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { Paper as TPaper, basePath } from "../index";
import { getAvatar } from "../SideBar";
import { useStyles } from "./style";
import { getAllTags } from '../index';
// import Questions from '../Questions';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


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

    /*Question1: rank the value conflict pair*/
    // const [ranks, setRanks] = useState({});

    // useEffect(() => {
    //     if (currentPaper) {
    //         const newRanks = {};
    //         if (currentPaper.input_data.conflict_pair1) newRanks['pair1'] = '';
    //         if (currentPaper.input_data.conflict_pair2) newRanks['pair2'] = '';
    //         if (currentPaper.input_data.conflict_pair3) newRanks['pair3'] = '';
    //         setRanks(newRanks);
    //     }
    // }, [currentPaper]);

    // const handleRankChange = (pair, value) => {
    //     setRanks(prev => ({ ...prev, [pair]: value }));
    // };

    // const checkDisabled = (option, currentPair) => {
    //     return Object.values(ranks).filter((v, i) => `pair${i+1}` !== currentPair).includes(option);
    // };

    const [ranks, setRanks] = useState(() => {
        // Initialize ranks from localStorage if available
        const savedRanks = localStorage.getItem('pairRanks');
        return savedRanks ? JSON.parse(savedRanks) : {};
    });


    const handleRankChange = (scenarioID, pair, value) => {
        // setRanks(prev => ({
        //     ...prev,
        //     [scenarioID]: {
        //         ...prev[scenarioID],
        //         [pair]: value
        //     }
        // }));
        const newRanks = {
            ...ranks,
            [scenarioID]: {
                ...ranks[scenarioID],
                [pair]: value
            }
        };
        setRanks(newRanks);
        localStorage.setItem('pairRanks', JSON.stringify(newRanks));
    };

    const checkDisabled = (option, currentPair, currentPaper) => {
        const currentRanks = ranks[currentPaper?.scenarioID] || {};
        return Object.values(currentRanks).filter((v, i) => `pair${i+1}` !== currentPair).includes(option);
    };
    
    useEffect(() => {
        // update state from localStorage
        const savedRanks = localStorage.getItem('pairRanks');
        if (savedRanks) {
            setRanks(JSON.parse(savedRanks));
        }
    }, []);

    const findFirstRankedPair = (currentPaper) => {
        const scenarioRanks = ranks[currentPaper.scenarioID] || {};
        const pairKey = Object.entries(scenarioRanks).find(([key, value]) => value === '1st')
        if (pairKey) {
            const pair = pairKey[0]
            // console.log("Check first pair: ", Object.entries(scenarioRanks).find(([key, value]) => value === '1st'))
            // console.log("check pair:", currentPaper.input_data[`conflict_${pair}`][pair])
            return pair
        }
        return pairKey;
    }; 


    /*Question2: choose the factors influence the choice of the most conflicting value pair*/
    const [multiFactors, setMultiFactors] = useState(() => {
        const savedMultiFactors = localStorage.getItem('multiFactors');
        return savedMultiFactors ? JSON.parse(savedMultiFactors) : {};
    });
    
    const handleMultiFactorsChange = (scenarioID, pair, value, isChecked) => {
        const currentRanks = multiFactors[scenarioID] || {};
        const currentValues = currentRanks[pair] || [];
    
        const newValues = isChecked
            ? [...currentValues, value] // Add value if checked
            : currentValues.filter(item => item !== value); // Remove value if unchecked
    
        const newMultiRanks = {
            ...multiFactors,
            [scenarioID]: {
                ...currentRanks,
                [pair]: newValues
            }
        };
    
        setMultiFactors(newMultiRanks);
        localStorage.setItem('multiFactors', JSON.stringify(newMultiRanks));

        handleSelectionChange(scenarioID, pair, newValues);        
    };

    useEffect(() => {
        const savedMultiFactors = localStorage.getItem('multiFactors');
        if (savedMultiFactors) {
            setMultiFactors(JSON.parse(savedMultiFactors));
        }
    }, []);

    /*Question3: choose the social context*/
    const [socialContext, setSocialContext] = useState(() => {
        const savedContext = localStorage.getItem('socialContext');
        return savedContext ? JSON.parse(savedContext) : '';
    });

    const handleSocialContextChange = (scenarioID, value) => {
        // setSocialContext(value);
        // localStorage.setItem('socialContext', JSON.stringify(value));
        const newSocialContext = {
            ...socialContext,
            [scenarioID]: value
        };
        setSocialContext(newSocialContext);
        localStorage.setItem('socialContext', JSON.stringify(newSocialContext));
    };
    
    useEffect(() => {
        const savedContext = localStorage.getItem('socialContext');
        if (savedContext) {
            setSocialContext(JSON.parse(savedContext));
        }
    }, []);
    
    /*Question4: choose the time urgency*/
    const [timeUrgency, setTimeUrgency] = useState(() => {
        const savedUrgency = localStorage.getItem('timeUrgency');
        return savedUrgency ? JSON.parse(savedUrgency) : {};
    });

    const handleTimeUrgencyChange = (scenarioID, value) => {
        const newTimeUrgency = {
            ...timeUrgency,
            [scenarioID]: value
        };
        setTimeUrgency(newTimeUrgency);
        localStorage.setItem('timeUrgency', JSON.stringify(newTimeUrgency));
    };

    useEffect(() => {
        const savedUrgency = localStorage.getItem('timeUrgency');
        if (savedUrgency) {
            setTimeUrgency(JSON.parse(savedUrgency));
        }
    }, []);
    
    /*Question5: choose the level of consequence and explain*/
    const [consequence, setConsequence] = useState(() => {
        const savedConsequence = localStorage.getItem('consequenceLevel');
        return savedConsequence ? JSON.parse(savedConsequence) : {};
    });
    
    const [consequenceReason, setConsequenceReason] = useState(() => {
        const savedReason = localStorage.getItem('consequenceReason');
        return savedReason ? JSON.parse(savedReason) : {};
    });
    
    const handleConsequenceChange = (scenarioID, value) => {
        const newConsequence = {
            ...consequence,
            [scenarioID]: value
        };
        setConsequence(newConsequence);
        localStorage.setItem('consequenceLevel', JSON.stringify(newConsequence));
    };
    
    const handleConsequenceReasonChange = (scenarioID, text) => {
        const newReason = {
            ...consequenceReason,
            [scenarioID]: text
        };
        setConsequenceReason(newReason);
        localStorage.setItem('consequenceReason', JSON.stringify(newReason));
    };

    useEffect(() => {
        const savedConsequence = localStorage.getItem('consequenceLevel');
        const savedReason = localStorage.getItem('consequenceReason');
        if (savedConsequence) {
            setConsequence(JSON.parse(savedConsequence));
        }
        if (savedReason) {
            setConsequenceReason(JSON.parse(savedReason));
        }
    }, []);

    /*Question6: What factors might cause your values to change concerning this scenario?*/
    const [selectedFactors, setSelectedFactors] = useState(() => {
        const savedFactors = localStorage.getItem('selectedFactors');
        return savedFactors ? JSON.parse(savedFactors) : {};
    });

    const handleFactorChange = (scenarioID, pair, factor, isChecked) => {
        const currentRanks = selectedFactors[scenarioID] || {};
        const currentFactors = currentRanks[pair] || [];

        const newFactors = isChecked
            ? [...currentFactors, factor] 
            : currentFactors.filter(item => item !== factor); 
    
        const newSelectedFactors = {
            ...selectedFactors,
            [scenarioID]: {
                ...currentRanks,
                [pair]: newFactors
            }
        };
    
        setSelectedFactors(newSelectedFactors);
        localStorage.setItem('selectedFactors', JSON.stringify(newSelectedFactors));
    };

    useEffect(() => {
        const savedFactors = localStorage.getItem('selectedFactors');
        if (savedFactors) {
            setSelectedFactors(JSON.parse(savedFactors));
        }
    }, []);

    /*TASKB-Question7: Find best strategy*/
    const [strategyRankings, setStrategyRankings] = useState(() => {
        const savedRankings = localStorage.getItem('strategyRankings');
        return savedRankings ? JSON.parse(savedRankings) : {};
    });
    
    const [strategyReasons, setStrategyReasons] = useState(() => {
        const savedReasons = localStorage.getItem('strategyReasons');
        return savedReasons ? JSON.parse(savedReasons) : {};
    });
    
    const handleStrategyChange = (scenarioID, strategyType, strategy) => {
        console.log("strategyType and strategy", strategyType, "-", strategy)
        const newStrategyRankings = {
            ...strategyRankings,
            [scenarioID]: {
                ...strategyRankings[scenarioID],
                [strategyType]: strategy
            }
        };
        setStrategyRankings(newStrategyRankings);
        localStorage.setItem('strategyRankings', JSON.stringify(newStrategyRankings));
    };
    
    const handleReasonChange = (scenarioID, text) => {
        const newReasons = {
            ...strategyReasons,
            [scenarioID]: text
        };
        setStrategyReasons(newReasons);
        localStorage.setItem('strategyReasons', JSON.stringify(newReasons));
    };

    useEffect(() => {
        const savedRankings = localStorage.getItem('strategyRankings');
        const savedReasons = localStorage.getItem('strategyReasons');
        if (savedRankings) {
            setStrategyRankings(JSON.parse(savedRankings));
        }
        if (savedReasons) {
            setStrategyReasons(JSON.parse(savedReasons));
        }
    }, []);

    const getBestStrategy = (currentPaper) => {
        // Access the strategy rankings from the state first
        let bestStrategy = strategyRankings[currentPaper.scenarioID]?.best;
    
        // If the state does not have the information, attempt to retrieve from localStorage
        if (!bestStrategy) {
            const savedRankings = localStorage.getItem('strategyRankings');
            if (savedRankings) {
                const strategyRankings = JSON.parse(savedRankings);
                bestStrategy = strategyRankings[currentPaper.scenarioID]?.best;
            }
        }
    
        // Log the retrieved best strategy for debugging
        // console.log(`Best strategy for ${currentPaper.scenarioID}: ${bestStrategy}`);
    
        return bestStrategy;
    };
    

    // const initialStrategies = ['Prioritization', 'Balancing', 'Reframing', 'Goal Setting', 'Behavioral Experimentation'];
    // const [strategies, setStrategies] = useState(initialStrategies);
    // const [reason, setReason] = useState('');

    // // Load from localStorage
    // useEffect(() => {
    //     const data = localStorage.getItem(currentPaper.scenarioID + '-strategies');
    //     if (data) {
    //         setStrategies(JSON.parse(data));
    //     }
    // }, [currentPaper.scenarioID]);

    // const onDragEnd = (currentPaper, result) => {
    //     if (!result.destination) return;
    //     const items = Array.from(strategies);
    //     const [reorderedItem] = items.splice(result.source.index, 1);
    //     items.splice(result.destination.index, 0, reorderedItem);
    //     setStrategies(items);
    //     localStorage.setItem(currentPaper.scenarioID + '-strategies', JSON.stringify(items));
    // };

    
    /*TASKB-Question8: potential cause*/
    const [choiceInfluence, setChoiceInfluence] = useState(() => {
        const savedInfluence = localStorage.getItem('choiceInfluence');
        return savedInfluence ? JSON.parse(savedInfluence) : {};
    });
    
    useEffect(() => {
        const savedInfluence = localStorage.getItem('choiceInfluence');
        if (savedInfluence) {
            setChoiceInfluence(JSON.parse(savedInfluence));
        }
    }, []);

    const handleInfluenceSelection = (scenarioID, influence) => {
        const newInfluence = {
            ...choiceInfluence,
            [scenarioID]: influence
        };
    
        setChoiceInfluence(newInfluence);
        localStorage.setItem('choiceInfluence', JSON.stringify(newInfluence));
    };
    
    

    /*TASKB-Question9: adopt?*/
    const [reasonForNotAdopting, setReasonForNotAdopting] = useState(() => {
        const savedReasons = localStorage.getItem('reasonForNotAdopting');
        return savedReasons ? JSON.parse(savedReasons) : {};
    });

    const handleReasonSelection = (scenarioID, pair, reason) => {
        const newReasonForNotAdopting = {
            ...reasonForNotAdopting,
            [scenarioID]: {
                ...reasonForNotAdopting[scenarioID],
                [pair]: reason
            }
        };
    
        setReasonForNotAdopting(newReasonForNotAdopting);
        localStorage.setItem('reasonForNotAdopting', JSON.stringify(newReasonForNotAdopting));
    
        // Log the updated reason for debugging
        console.log(`Updated reason for not adopting the strategy for ${scenarioID}, ${pair}: ${reason}`);
    };
    
    
    useEffect(() => {
        const savedReasons = localStorage.getItem('reasonForNotAdopting');
        if (savedReasons) {
            setReasonForNotAdopting(JSON.parse(savedReasons));
        }
    }, []);      

    // Progress tracking
    const [progress, setProgress] = useState({});

    // const handleSelectionChange = (scenarioID, questionID, isCompleted) => {
    // // 更新特定 scenarioID 下的特定问题的完成状态
    // const newProgress = {
    //     ...progress,
    //     [scenarioID]: {
    //     ...progress[scenarioID],
    //     [questionID]: isCompleted
    //     }
    // };
    // setProgress(newProgress);
    // };

    const handleSelectionChange = (scenarioID, questionID, selections) => {
        const newProgress = {...progress};
        // 检查是否有任何选项被选中
        const isCompleted = selections.length > 0;
        newProgress[scenarioID] = {
          ...newProgress[scenarioID],
          [questionID]: isCompleted
        };
        setProgress(newProgress);
    };
      

    const calculateProgress = (scenarioID) => {
        const scenarioProgress = progress[scenarioID] || {};
        const totalQuestions = Object.keys(scenarioProgress).length;
        const completedQuestions = Object.values(scenarioProgress).filter(Boolean).length;

        console.log("scenarioID ", scenarioID, ": ", totalQuestions > 0 ? (completedQuestions / totalQuestions * 100).toFixed(0) : 0)
        return totalQuestions > 0 ? (completedQuestions / totalQuestions * 100).toFixed(0) : 0;
    };





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

                                    <div className={classes.grow}> </div>
                                    <div className={classes.tags}>
                                        {Object.entries(allTags).map(([group, value]) => (
                                            <AvatarGroup key={group} className={classes.avatarGroup}>
                                                {/* {paper[group]?.map((v) => (
                                                    <Avatar key={v} style={{
                                                        backgroundColor: getBgColor(group),
                                                        width: 32,
                                                        height: 32,
                                                        fontSize: "14px",
                                                        marginLeft: "-4px"
                                                    }}>
                                                        <AvatarComponent group={group} tag={v} bgcolor={getBgColor(group)} />
                                                    </Avatar>
                                                ))} */}
                                                {paper[group]?.map((v) => {
                                                    return (
                                                        // <Avatar key={v} style={{
                                                        //     backgroundColor: getBgColor(group),
                                                        //     width: 32,
                                                        //     height: 32,
                                                        //     fontSize: "14px",
                                                        //     marginLeft: "-4px"
                                                        // }}>
                                                        //     {/* Assuming AvatarComponent properly handles the props */}
                                                        //     <AvatarComponent group={group} tag={v} bgcolor={getBgColor(group)} />
                                                        //     {/* Displaying avatar name if needed: <b>{getAvatar(v)}</b> */}
                                                        // </Avatar>
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


                                </CardContent>
                                {/* <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions> */}
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
                        {/* <h1>Scenario: {currentPaper?.name}</h1> */}

                        <Typography variant="h4">Scenario: {currentPaper?.name}</Typography>

                        <div className={classes.taskAContent}>
                        {/* <div style="background-color: #f8f2fa; margin-top: 0; padding-top: 0; margin-bottom: 0" class="MUSTFIX">*/}
                            <Typography variant="subtitle1" className={classes.taskAstart}>
                                TaskA: Rank the following three conflicting value pairs, listing the most conflicting pair first (the most conflicting pair is more conflicting than the other in conflicting scenario). And answer the following questions.
                            </Typography> 
                            
                            {/* <div>
                                {currentPaper && Object.entries(currentPaper.input_data).map(([key, value], index) => (
                                    <p key={key}>
                                    {value[`pair${index + 1}`]}
                                    <select 
                                        value={ranks[`pair${index + 1}`]} 
                                        onChange={(e) => handleRankChange(`pair${index + 1}`, e.target.value)}
                                    >
                                        <option value="">Select Rank</option>
                                        <option value="1st" disabled={checkDisabled("1st", `pair${index + 1}`)}>1st</option>
                                        <option value="2nd" disabled={checkDisabled("2nd", `pair${index + 1}`)}>2nd</option>
                                        <option value="3rd" disabled={checkDisabled("3rd", `pair${index + 1}`)}>3rd</option>
                                    </select>
                                    </p>
                                ))}
                            </div> */}
                            <fieldset className="questions">
                                {currentPaper && Object.entries(currentPaper.input_data).map(([key, value], index) => (
                                    <p key={key}>
                                        {value[`pair${index + 1}`]}
                                        <select
                                            value={ranks[currentPaper?.scenarioID]?.[`pair${index + 1}`] || ''}
                                            onChange={(e) => {handleRankChange(currentPaper?.scenarioID, `pair${index + 1}`, e.target.value);
                                                              handleSelectionChange(currentPaper?.scenarioID, `pair${index + 1}`, Boolean(e.target.value));
                                                                                              
                                            }}
                                            
                                        >
                                            <option value="">Select Rank</option>
                                            <option value="1st" disabled={checkDisabled("1st", `pair${index + 1}`, currentPaper)}>1st</option>
                                            <option value="2nd" disabled={checkDisabled("2nd", `pair${index + 1}`, currentPaper)}>2nd</option>
                                            <option value="3rd" disabled={checkDisabled("3rd", `pair${index + 1}`, currentPaper)}>3rd</option>
                                        </select>
                                    </p>
                                ))}
                                <legend>Progress: {calculateProgress(currentPaper?.scenarioID)}%</legend>
                            </fieldset>

                            <fieldset className="questions">
                                {currentPaper && (() => {
                                    const firstRankedPair = findFirstRankedPair(currentPaper);
                                    // console.log("firstRankedPair: ", firstRankedPair)
                                    if (!firstRankedPair) return null; 
                                    // const [pairKey, ] = firstRankedPair;

                                    return (
                                        <div key={firstRankedPair}>
                                            <label>What factors influence your choice of the most conflicting value pair? ({currentPaper.input_data[`conflict_${firstRankedPair}`][firstRankedPair]})</label>
                                            {['Emotional factors', 'Social factors', 'Moral factors', 'Personal Preferences & Goals & Self Perception', 'Other factors'].map(factor => (
                                                <div key={factor}>
                                                    <input
                                                        type="checkbox"
                                                        checked={multiFactors[currentPaper.scenarioID]?.[firstRankedPair]?.includes(factor)}
                                                        onChange={(e) => handleMultiFactorsChange(currentPaper.scenarioID, firstRankedPair, factor, e.target.checked)}
                                                    />
                                                    {factor}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </fieldset>

                            <fieldset className="questions">
                                {currentPaper && (
                                    <div>
                                        <label>What is the social context of the most conflicting value pair in this scenario?</label>
                                        <select
                                            value={socialContext[currentPaper.scenarioID] || ''}
                                            onChange={(e) => handleSocialContextChange(currentPaper.scenarioID, e.target.value)}
                                        >
                                            <option value="">Select Social Context</option>
                                            <option value="Family">Family</option>
                                            <option value="Friends">Friends</option>
                                            <option value="Romantic Relationship">Romantic Relationship</option>
                                            <option value="Workplace">Workplace</option>
                                            <option value="Acquaintance">Acquaintance</option>
                                            <option value="Stranger">Stranger</option>
                                            <option value="Other">Other (Please specify below)</option>
                                        </select>
                                    </div>
                                )}
                            </fieldset>

                            <fieldset className="questions">
                                {currentPaper && (
                                    <div>
                                        <label>What kind of time urgency is present in scenario?</label>
                                        <select
                                            value={timeUrgency[currentPaper.scenarioID] || ''}
                                            onChange={(e) => handleTimeUrgencyChange(currentPaper.scenarioID, e.target.value)}
                                        >
                                            <option value="">Select Time Urgency</option>
                                            <option value="Implicit">Implicit</option>
                                            <option value="Explicit">Explicit</option>
                                            <option value="N/A">N/A</option>
                                        </select>
                                    </div>
                                )}
                            </fieldset>

                            <fieldset className="questions">
                                {currentPaper && (
                                    <div>
                                        <label>What do you think is the level of consequence of this value conflict according to you?</label>
                                        <select
                                            value={consequence[currentPaper.scenarioID] || ''}
                                            onChange={(e) => handleConsequenceChange(currentPaper.scenarioID, e.target.value)}
                                        >
                                            <option value="">Select Consequence Level</option>
                                            <option value="Mild">Mild</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                        <textarea
                                            placeholder="Reasons for the Choice of the Level of Consequence"
                                            value={consequenceReason[currentPaper.scenarioID] || ''}
                                            onChange={(e) => handleConsequenceReasonChange(currentPaper.scenarioID, e.target.value)}
                                            style={{ width: '100%', height: '100px' }}
                                        />
                                    </div>
                                )}
                            </fieldset>

                            <fieldset className="questions">
                                {/* {currentPaper && (

                                    <div>
                                        <label>What factors might cause your values to change concerning this scenario?</label>
                                        {['Factor 1', 'Factor 2', 'Factor 3', 'Other circumstance'].map((factor, index) => (
                                            <div key={factor}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFactors[currentPaper.scenarioID]?.includes(factor)}
                                                    onChange={(e) => handleFactorChange(currentPaper.scenarioID, factor, e.target.checked)}
                                                />
                                                {factor} 
                                            </div>
                                        ))}
                                    </div>
                                )} */}
                                {currentPaper && (() => {
                                    const firstRankedPair = findFirstRankedPair(currentPaper);
                                    // console.log("firstRankedPair: ", firstRankedPair)
                                    if (!firstRankedPair) return null; 
                                    // const [pairKey, ] = firstRankedPair;

                                    return (
                                        <div key={firstRankedPair}>
                                            <label>What factors might cause your values to change concerning this scenario?</label>
                                            {[currentPaper.input_data[`conflict_${firstRankedPair}`][`${firstRankedPair}_reason1`], currentPaper.input_data[`conflict_${firstRankedPair}`][`${firstRankedPair}_reason2`], currentPaper.input_data[`conflict_${firstRankedPair}`][`${firstRankedPair}_reason3`], 'Other circumstance'].map(factor => (
                                                <div key={factor}>
                                                    <input
                                                        type="checkbox"
                                                        // checked={selectedFactors[currentPaper.scenarioID]?.includes(factor)}
                                                        checked={selectedFactors[currentPaper.scenarioID]?.[firstRankedPair]?.includes(factor)}
                                                        onChange={(e) => handleFactorChange(currentPaper.scenarioID, firstRankedPair, factor, e.target.checked)}
                                                    />
                                                    {factor}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </fieldset>

                        </div>

                        <div className={classes.taskBContent}>
                        {/* <div style="background-color: #f8f2fa; margin-top: 0; padding-top: 0; margin-bottom: 0" class="MUSTFIX">*/}
                            <Typography variant="subtitle2" className={classes.taskBstart}>
                                TaskB: Based on the most conflicting pair and the conflicting scenario, choose three best strategies and rank them, briefly explain the reasons for your choice.
                            </Typography> 

                            <fieldset className="questions">
                                <h3>Explanations for all 6 strategies based on the scenario and the pair:</h3>
                                {/* <ul>
                                    <li>Prioritization: {currentPaper.input_data["pair1-2-prioritization"]}</li>
                                    <li>Balancing: {currentPaper.input_data["pair1-2-balancing"]}</li>
                                    <li>Reframing: {currentPaper.input_data["pair1-2-reframing"]}</li>
                                    <li>Goal Setting: {currentPaper.input_data["pair1-2-goal_setting"]}</li>
                                    <li>Behavioral Experimentation: {currentPaper.input_data["pair1-2-behavioral_experimentation"]}</li>
                                </ul> */}
                                {currentPaper && (() => {
                                    const firstRankedPair = findFirstRankedPair(currentPaper);
                                    console.log("firstRankedPair here: ", firstRankedPair);
                                    if (!firstRankedPair) return null;
                                    
                                    return (
                                        <ul>
                                            <li>Self_reflection: {currentPaper.input_data[`conflict_${firstRankedPair}`][`${firstRankedPair}_self_reflection`]}</li>
                                            <li>Prioritization: {currentPaper.input_data[`conflict_${firstRankedPair}`][`${firstRankedPair}_prioritization`]}</li>
                                            <li>Balancing: {currentPaper.input_data[`conflict_${firstRankedPair}`][`${firstRankedPair}_balancing`]}</li>
                                            <li>Reframing: {currentPaper.input_data[`conflict_${firstRankedPair}`][`${firstRankedPair}_reframing`]}</li>
                                            <li>Goal Setting: {currentPaper.input_data[`conflict_${firstRankedPair}`][`${firstRankedPair}_goal_setting`]}</li>
                                            <li>Behavioral Experimentation: {currentPaper.input_data[`conflict_${firstRankedPair}`][`${firstRankedPair}_behavioral_experimentation`]}</li>
                                        </ul>
                                    );
                                })()}
                            </fieldset>

                            
                            <fieldset className="questions">
                                {currentPaper && (
                                    <div>
                                        <label>Choose your preferred resolution strategies and explain your choice of the best strategy:</label>
                                        <div>
                                            <select
                                                value={strategyRankings[currentPaper.scenarioID]?.best || ''}
                                                onChange={(e) => handleStrategyChange(currentPaper.scenarioID, 'best', e.target.value)}
                                            >
                                                <option value="">Select Best Strategy</option>
                                                <option value="self_reflection">Self Reflection</option>
                                                <option value="prioritization">Prioritization</option>
                                                <option value="balancing">Balancing</option>
                                                <option value="reframing">Reframing</option>
                                                <option value="goal_setting">Goal Setting</option>
                                                <option value="behavioral_experimentation">Behavioral Experimentation</option>
                                            </select>
                                        </div>
                                        <textarea
                                            placeholder="Reasons for strategy chosen"
                                            value={strategyReasons[currentPaper.scenarioID] || ''}
                                            onChange={(e) => handleReasonChange(currentPaper.scenarioID, e.target.value)}
                                            style={{ width: '100%', height: '100px' }}
                                        />
                                        
                                    </div>
                                )}
                            </fieldset>

                            {/* <div>
                                {currentPaper && (() => {
                                    const firstRankedPair = findFirstRankedPair(currentPaper);
                                    console.log("firstRankedPair: ", firstRankedPair)
                                    if (!firstRankedPair) return null; 
                                    const bestStrategy = getBestStrategy(currentPaper).toLowerCase().replace(/ /g, '_');
                                    console.log(`Currently selected best strategy for scenario ${currentPaper.scenarioID} is: ${bestStrategy}`);

                                    return (   
                                        <div key={firstRankedPair}>
                                            <label>What would be some factors that would hold you back from actually adopting this strategy?</label>
                                            {[currentPaper.input_data[`conflict_${firstRankedPair}`][`${firstRankedPair}-${bestStrategy}_inhibitor1`], currentPaper.input_data[`conflict_${firstRankedPair}`][`${firstRankedPair}-${bestStrategy}_inhibitor2`], currentPaper.input_data[`conflict_${firstRankedPair}`][`${firstRankedPair}-${bestStrategy}_inhibitor3`], 'Other factors'].map(reason => (
                                                <div key={reason}>
                                                    <input
                                                        type="radio"
                                                        checked={reasonForNotAdopting[currentPaper.scenarioID]?.[firstRankedPair]?.includes(reason)}
                                                        onChange={(e) => handleReasonSelection(currentPaper.scenarioID, firstRankedPair, reason, e.target.checked)}
                                                    />
                                                    {reason}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div> */}

                            <fieldset className="questions">
                                {currentPaper && (
                                    <div>
                                        <label>Do you feel your choice was more influenced by logical reasoning or emotional concerns?</label>
                                        <div>
                                            <input
                                                type="radio"
                                                name="influence"
                                                value="Logical Reasoning"
                                                checked={choiceInfluence[currentPaper.scenarioID] === 'Logical Reasoning'}
                                                onChange={() => handleInfluenceSelection(currentPaper.scenarioID, 'Logical Reasoning')}
                                            /> Logical Reasoning
                                            <input
                                                type="radio"
                                                name="influence"
                                                value="Emotional Concerns"
                                                checked={choiceInfluence[currentPaper.scenarioID] === 'Emotional Concerns'}
                                                onChange={() => handleInfluenceSelection(currentPaper.scenarioID, 'Emotional Concerns')}
                                            /> Emotional Concerns
                                            <input
                                                type="radio"
                                                name="influence"
                                                value="Both"
                                                checked={choiceInfluence[currentPaper.scenarioID] === 'Both'}
                                                onChange={() => handleInfluenceSelection(currentPaper.scenarioID, 'Both')}
                                            /> Both
                                        </div>
                                    </div>
                                )}
                            </fieldset>


                            <fieldset className="questions">
                                {currentPaper && (() => {
                                    const firstRankedPair = findFirstRankedPair(currentPaper);
                                    // console.log("firstRankedPair: ", firstRankedPair);
                                    if (!firstRankedPair) return null; 
                                    const bestStrategy = getBestStrategy(currentPaper).toLowerCase().replace(/ /g, '_');
                                    // console.log(`Currently selected best strategy for scenario ${currentPaper.scenarioID} is: ${bestStrategy}`);

                                    return (   
                                        <div key={firstRankedPair}>
                                            <label>What would be some factors that would hold you back from actually adopting this strategy?</label>
                                            {[currentPaper.input_data[`conflict_${firstRankedPair}`][`${firstRankedPair}-${bestStrategy}_inhibitor1`], currentPaper.input_data[`conflict_${firstRankedPair}`][`${firstRankedPair}-${bestStrategy}_inhibitor2`], currentPaper.input_data[`conflict_${firstRankedPair}`][`${firstRankedPair}-${bestStrategy}_inhibitor3`], 'Other factors'].map(reason => (
                                                <div key={reason}>
                                                    <input
                                                        type="radio"
                                                        name="reason"  // Ensure all radio buttons share the same name
                                                        checked={reasonForNotAdopting[currentPaper.scenarioID]?.[firstRankedPair] === reason}
                                                        onChange={(e) => handleReasonSelection(currentPaper.scenarioID, firstRankedPair, reason)}
                                                    />
                                                    {reason}
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </fieldset>





                        </div>
                            



                        
                        <Button onClick={closeModal} color="secondary">Close</Button>
                    </div>
                </Fade>
            </Modal>
        </Grid>

        
    );
}
