import React, { useState } from "react";
import { Grid, Card, Avatar, CardContent, CardMedia, Typography, Modal, Button, Backdrop, Fade, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Select, MenuItem, Paper} from "@material-ui/core";
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { Paper as TPaper, basePath } from "../index";
import { getAvatar } from "../SideBar";
import { useStyles } from "./style";
import { getAllTags } from '../index';
// import Questions from '../Questions';


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


    const AvatarComponent = ({ group, tag, bgcolor }) => {
        const avatarSrc = `${basePath}/assets/avatars/${group}_${tag}.png`;
        return (
            <Avatar alt={getAvatar(tag)} src={avatarSrc} style={{ width: 24, height: 24, backgroundColor: bgcolor, color: "white" }}><b style={{ fontSize: '0.75rem' }}>{getAvatar(tag)}</b></Avatar>
        );
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
                                                {paper[group]?.map((v) => (
                                                    <Avatar key={v} style={{
                                                        backgroundColor: getBgColor(group),
                                                        width: 32,
                                                        height: 32,
                                                        fontSize: "14px",
                                                        marginLeft: "-4px"
                                                    }}>
                                                        <AvatarComponent group={group} tag={v} bgcolor={getBgColor(group)} />
                                                        {/* <b>{getAvatar(v)}</b> */}
                                                    </Avatar>
                                                ))}
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
                            {/* <b style="font-size: 22px">TaskA: Rank the following three conflicting value pairs, listing the most conflicting pair first (the most conflicting pair is more conflicting than the other in conflicting scenario). And answer the following questions.</b> */}
                            <FormControl component="fieldset" className={classes.fieldsetStyle}>
                                {/* <div class="question-group" style="padding-bottom: 13px; border-bottom: 2px dashed #8fadfd" question-id="2">                                 */}
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                        // <Select required>
                                        //     <MenuItem value=""><em>Select Rank</em></MenuItem>
                                        //     <MenuItem value="1">1st - {currentPaper?.input_data.conflict_pair1.pair1}</MenuItem>
                                        //     <MenuItem value="2">2nd - {currentPaper?.input_data.conflict_pair2.pair1}</MenuItem>
                                        //     <MenuItem value="3">3rd - {currentPaper?.input_data.conflict_pair3.pair1}</MenuItem>
                                        // </Select>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <div>
                                                {currentPaper?.input_data.conflict_pair1.pair1} 
                                                <Select defaultValue="" style={{ marginLeft: '10px' }}>
                                                    <MenuItem value=""><em>None</em></MenuItem>
                                                    <MenuItem value="1">1st</MenuItem>
                                                    <MenuItem value="2">2nd</MenuItem>
                                                    <MenuItem value="3">3rd</MenuItem>
                                                </Select>
                                            </div>
                                            <div>
                                                {currentPaper?.input_data.conflict_pair2.pair1}
                                                <Select defaultValue="" style={{ marginLeft: '10px' }}>
                                                    <MenuItem value=""><em>None</em></MenuItem>
                                                    <MenuItem value="1">1st</MenuItem>
                                                    <MenuItem value="2">2nd</MenuItem>
                                                    <MenuItem value="3">3rd</MenuItem>
                                                </Select>
                                            </div>
                                            <div>
                                                {currentPaper?.input_data.conflict_pair3.pair1}
                                                <Select defaultValue="" style={{ marginLeft: '10px' }}>
                                                    <MenuItem value=""><em>None</em></MenuItem>
                                                    <MenuItem value="1">1st</MenuItem>
                                                    <MenuItem value="2">2nd</MenuItem>
                                                    <MenuItem value="3">3rd</MenuItem>
                                                </Select>
                                            </div>
                                        </div>
                                        }
                                        label={`Rank for Pairs`}
                                        labelPlacement="top"
                                    />
                                    {/* Repeat for other pairs */}
                                    </FormGroup>

                                    {/* <fieldset style="background-color: #fcfbef; margin-left: 25px; margin-right: 80px">
                                        <ul>
                                            <li>
                                                <label for="option1_2">${pair2-1}</label>
                                                <select name="scenario2-option1" id="option1_2" class="rank-select" required>
                                                    <option value="">Select Rank</option>
                                                    <option value="1">1st</option>
                                                    <option value="2">2nd</option>
                                                    <option value="3">3rd</option>
                                                </select>
                                            </li>
                                        
                                            <li>
                                                <label for="option2_2">${pair2-2}</label>
                                                <select name="scenario2-option2" id="option2_2" class="rank-select" required>
                                                    <option value="">Select Rank</option>
                                                    <option value="1">1st</option>
                                                    <option value="2">2nd</option>
                                                    <option value="3">3rd</option>
                                                </select>
                                            </li>
                                            
                                           
                                            <li>
                                                <label for="option3_2">${pair2-3}</label>
                                                <select name="scenario2-option3" id="option3_2" class="rank-select" required>
                                                    <option value="">Select Rank</option>
                                                    <option value="1">1st</option>
                                                    <option value="2">2nd</option>
                                                    <option value="3">3rd</option>
                                                </select>
                                            </li>
                                        </ul>   
                                    </fieldset> */}

                                    <FormLabel component="legend" className={classes.taskAstart}>
                                        ➊ What factors influence your choice of the most conflicting value pair? (<span style={{ color: '#000' }}>{currentPaper?.input_data.conflict_pair1.pair1}</span>)
                                    </FormLabel>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<Checkbox name="scenario2_emotional_factors" />}
                                            label="Emotional factors (For example: Did emotions like guilt, anxiety, sadness, or hope play a role in your decision?)"
                                        />
                                        {/* TODO: Repeat for other factors */}
                                    </FormGroup>

                                    
                                {/* </div> */}
                                {/* <div class="follow_up_questions" style="padding-bottom: 8px; border-bottom: 8px dashed #8fadfd">
                                    <div style="padding-bottom: 15px; border-bottom: 2px dashed #8fadfd">
                                        <b style="margin-top: 100px;">➊ What factors influence your choice of the most conflicting value pair? (<span id="selectedPair2_2" style="color: #eb232e;"></span>)</b>
                                        <fieldset style="background-color: #fcfbef; margin-left: 25px; margin-right: 80px;">
                                            <legend>Select factors:</legend>
                                            <div class="scenario2_factors">
                                                <div>
                                                    <input type="checkbox" id="scenario2_emotional_factors" name="scenario2_pair_factors" value="scenario2_emotional_factors">
                                                    <label for="scenario2_emotional_factors">
                                                        <span class="tooltip">Emotional factors
                                                            <span class="tooltiptext">
                                                                For example: Did emotions like guilt, anxiety, sadness, or hope play a role in your decision?
                                                            </span>
                                                        </span>
                                                    </label>
                                                </div>
                                                <div>
                                                    <input type="checkbox" id="scenario2_social_factors" name="scenario2_pair_factors" value="scenario2_social_factors">
                                                    <label for="scenario2_social_factors">
                                                        <span class="tooltip">Social factors
                                                            <span class="tooltiptext">
                                                                For example: Were you influenced by how others would perceive this decision (partner, family, peers)?
                                                            </span>
                                                        </span>
                                                    </label>
                                                </div>
                                                <div>
                                                    <input type="checkbox" id="scenario2_moral_factors" name="scenario2_pair_factors" value="scenario2_moral_factors">
                                                    <label for="scenario2_moral_factors">
                                                        <span class="tooltip">Moral factors
                                                            <span class="tooltiptext">
                                                                For example: Did your moral beliefs play a role in your choice?
                                                            </span>
                                                        </span>
                                                    </label>
                                                </div>
                                                <div>
                                                    <input type="checkbox" id="scenario2_personal_factors" name="scenario2_pair_factors" value="scenario2_personal_factors">
                                                    <label for="scenario2_personal_factors">
                                                        <span class="tooltip">Personal Preferences & Goals & Self Perception
                                                            <span class="tooltiptext">
                                                                For example: Personal Preferences: "I just like pineapple on pizza"<br>
                                                                                Personal Goals: Desire for better job/health/salary...<br>
                                                                                Self Perception: How do you perceive yourself?<br>
                                                            </span>
                                                        </span>    
                                                    </label>
                                                </div>
                                                <div>
                                                    <input type="checkbox" id="scenario2_other_factors" name="scenario2_pair_factors" value="scenario2_other_factors">
                                                    <label for="scenario2_other_factors">Other factors</label>
                                                    <input type="text" id="scenario2_other_factors_input" name="scenario2_other_factors_input" style="display:none;" placeholder="Type your factor here" autocomplete="off">
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>

                                    <div style="padding-bottom: 15px; border-bottom: 2px dashed #8fadfd">
                                        <p><strong>➋ What is the social context of the most conflicting value pair in this scenario?</strong></p>
                                        <!-- <label for="scenario2_context">Choose Social Context: </label> -->

                                        <fieldset style="background-color: #fcfbef; margin-left: 25px; margin-right: 80px;">
                                            <legend>Choose Social Context:</legend>
                                        
                                            <select name="scenario2_context" id="scenario2_context" onchange="handleSelectChange(this)" required>
                                                <option value="">Select Social Context</option>
                                                <option value="family">Family</option>
                                                <option value="friends">Friends</option>
                                                <option value="romantic_relationship">Romantic Relationship</option>
                                                <option value="workplace">Workplace</option>
                                                <option value="acquaintance">Acquaintance</option>
                                                <option value="stranger">Stranger</option>
                                                <option value="other">Other (Please specify below)</option>
                                            </select>
                                            <input type="text" id="scenario2_context_other" name="scenario2_context_other" style="display:none;" placeholder="Type your context here" autocomplete="off">
                                    </fieldset>
                                    </div>

                                    <div style="padding-bottom: 15px; border-bottom: 2px dashed #8fadfd">
                                        <p><strong>➌ What kind of <span class="tooltip" style="text-decoration: underline; color:#1b43b1">time urgency
                                                                    <span class="tooltiptext">
                                                                        Implicit: there is a time constraint associated with the consequence of the scenario<br><br>
                                                                        Explicit: there's an actual deadline in the scenario
                                                                    </span>
                                                                  </span>
                                                                  is present in scenario?</strong></p>
                                        <!-- <label for="scenario2_time_urgency">Choose the Time Urgency: </label> -->
                                        <fieldset style="background-color: #fcfbef; margin-left: 25px; margin-right: 80px;">
                                            <legend>Choose the Time Urgency:</legend>
                                            <select name="scenario2_time_urgency" id="scenario2_time_urgency" required>
                                                <option value="">Select Time Urgency</option>
                                                <option value="implicit">Implicit</option>
                                                <option value="explicit">Explicit</option>
                                                <option value="na">N/A</option>
                                            </select>
                                        </fieldset>
                                        <!--<label><input type="radio" name="example1_time_urgency" value="implicit" disabled> Implicit</label><br>-->
                                        <!--<label><input type="radio" name="example1_time_urgency" value="explicit" disabled> Explicit</label><br>-->
                                        <!--<label><input type="radio" name="example1_time_urgency" value="na" checked> N/A</label><br>-->
                                    </div>
                                    
                                    <div style="padding-bottom: 15px; border-bottom: 2px dashed #8fadfd">
                                        <p><strong>➍ What do you think is the <span class="tooltip" style="text-decoration: underline; color:#1b43b1">level of consequence 
                                                                                <span class="tooltiptext">
                                                                                    mild : i will suffer hardly any consequences<br><br>
                                                                                    medium : i will suffer some consequences which i can tolerate<br><br>
                                                                                    high : I will suffer extreme consequences
                                                                                </span>
                                                                              </span>                                                    
                                                                                of this value conflict according to you ?</strong></p>
                                        <!-- <label for="scenario2_consequence">Choose the Level of Consequence: </label> -->
                                        <fieldset style="background-color: #fcfbef; margin-left: 25px; margin-right: 80px; margin-bottom: 10px;">
                                            <legend>Choose the Level of Consequence and Explain:</legend>
                                            <select name="scenario2_consequence" id="scenario2_consequence" required>
                                                <option value="">Select Consequence Level</option>
                                                <option value="mild">Mild</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                            <br><br>
                                            <!--<p><strong>Reason:</strong></p>-->
                                            <b style="font-size: 95%;">Reasons for the Choice of the Level of Consequence:</b>
                                            <textarea name="scenario2_consequence_reason" class="textarea" placeholder="Explain the reason for the choice of the level of consequence" rows="2" required></textarea>
                                            <!--<input type="text" name="example1_consequence_reason" placeholder="Explain the reason for the choice of the level of consequence"><br><br>-->
                                                                                                
                                            <!--<label><input type="radio" name="example1_consequence" value="mild" disabled> Mild</label><br>-->
                                            <!--<label><input type="radio" name="example1_consequence" value="medium" checked> Medium</label><br>-->
                                            <!--<label><input type="radio" name="example1_consequence" value="high" disabled> High</label><br>-->
                                        </fieldset>
                                    </div>

                                    <div class="valueChange" style="padding-bottom: 15px">
                                        <p><strong>➎ What factors might cause your values to change concerning this scenario?</strong></p>
                                        <fieldset style="background-color: #fcfbef; margin-left: 25px; margin-right: 80px; margin-bottom: 10px;">
                                            <legend>Choose the circumstances (You can choose more than one):</legend>
                                            
                                            <div class="scenario2_pair1_reasons" style="display:none;">
                                                <input type="checkbox" id="scenario2_1_cirs1" name="scenario2_cirs" value="pair1_reason1">
                                                <label for="scenario2_1_cirs1">
                                                    <span class="tooltip">1. ${pair2-1_reason1}
                                                        <span class="tooltiptext">Detailed explanations: <br>
                                                            ${pair2-1_reason1D}
                                                        </span>
                                                    </span>
                                                </label><br>

                                                <input type="checkbox" id="scenario2_1_cirs2" name="scenario2_cirs" value="pair1_reason2">
                                                <label for="scenario2_1_cirs2">
                                                    <span class="tooltip">2. ${pair2-1_reason2}
                                                        <span class="tooltiptext">Detailed explanations: <br>
                                                            ${pair2-1_reason2D}
                                                        </span>
                                                    </span>
                                                </label><br>

                                                <input type="checkbox" id="scenario2_1_cirs3" name="scenario2_cirs" value="pair1_reason3">
                                                <label for="scenario2_1_cirs3">
                                                    <span class="tooltip">3. ${pair2-1_reason3}
                                                        <span class="tooltiptext">Detailed explanations: <br>
                                                            ${pair2-1_reason3D}
                                                        </span>
                                                    </span>
                                                </label><br>

                                                <!-- <input type="checkbox" id="scenario2_cirs6" name="scenario2_cirs" value="scenario2_cirs6">
                                                    <label for="scenario2_cirs6">Other circumstance</label>
                                                    <input type="text" id="scenario2_cirs6_other" name="scenario2_cirs6_other" style="display:none;" placeholder="Type your circumstance here" autocomplete="off"> -->
                                            </div>

                                            <div class="scenario2_pair2_reasons" style="display:none;">
                                                <input type="checkbox" id="scenario2_2_cirs1" name="scenario2_cirs" value="pair2_reason1">
                                                <label for="scenario2_2_cirs1">
                                                    <span class="tooltip">1. ${pair2-2_reason1}
                                                        <span class="tooltiptext">Detailed explanations: <br>
                                                            ${pair2-2_reason1D}
                                                        </span>
                                                    </span>
                                                </label><br>

                                                <input type="checkbox" id="scenario2_2_cirs2" name="scenario2_cirs" value="pair2_reason2">
                                                <label for="scenario2_2_cirs2">
                                                    <span class="tooltip">2. ${pair2-2_reason2}
                                                        <span class="tooltiptext">Detailed explanations: <br>
                                                            ${pair2-2_reason2D}
                                                        </span>
                                                    </span>
                                                </label><br>

                                                <input type="checkbox" id="scenario2_2_cirs3" name="scenario2_cirs" value="pair2_reason3">
                                                <label for="scenario2_2_cirs3">
                                                    <span class="tooltip">3. ${pair2-2_reason3}
                                                        <span class="tooltiptext">Detailed explanations: <br>
                                                            ${pair2-2_reason3D}
                                                        </span>
                                                    </span>
                                                </label><br>

                                                <!-- <input type="checkbox" id="scenario2_cirs6" name="scenario2_cirs" value="scenario2_cirs6">
                                                    <label for="scenario2_cirs6">Other circumstance</label>
                                                    <input type="text" id="scenario2_cirs6_other" name="scenario2_cirs6_other" style="display:none;" placeholder="Type your circumstance here" autocomplete="off"> -->
                                            </div>

                                            <div class="scenario2_pair3_reasons" style="display:none;">
                                                <input type="checkbox" id="scenario2_3_cirs1" name="scenario2_cirs" value="pair3_reason1">
                                                <label for="scenario2_3_cirs1">
                                                    <span class="tooltip">1. ${pair2-3_reason1}
                                                        <span class="tooltiptext">Detailed explanations: <br>
                                                            ${pair2-3_reason1D}
                                                        </span>
                                                    </span>
                                                </label><br>

                                                <input type="checkbox" id="scenario2_3_cirs2" name="scenario2_cirs" value="pair3_reason2">
                                                <label for="scenario2_3_cirs2">
                                                    <span class="tooltip">2. ${pair2-3_reason2}
                                                        <span class="tooltiptext">Detailed explanations: <br>
                                                            ${pair2-3_reason2D}
                                                        </span>
                                                    </span>
                                                </label><br>

                                                <input type="checkbox" id="scenario2_3_cirs3" name="scenario2_cirs" value="pair3_reason3">
                                                <label for="scenario2_3_cirs3">
                                                    <span class="tooltip">3. ${pair2-3_reason3}
                                                        <span class="tooltiptext">Detailed explanations: <br>
                                                            ${pair2-3_reason3D}
                                                        </span>
                                                    </span>
                                                </label><br>

                                                <!-- <input type="checkbox" id="scenario2_cirs6" name="scenario2_cirs" value="scenario2_cirs6">
                                                    <label for="scenario2_cirs6">Other circumstance</label>
                                                    <input type="text" id="scenario2_cirs6_other" name="scenario2_cirs6_other" style="display:none;" placeholder="Type your circumstance here" autocomplete="off"> -->
                                            </div>
                                            <input type="checkbox" id="scenario2_cirs6" name="scenario2_cirs" value="scenario2_cirs6">
                                                    <label for="scenario2_cirs6">Other circumstance</label>
                                                    <input type="text" id="scenario2_cirs6_other" name="scenario2_cirs6_other" style="display:none;" placeholder="Type your circumstance here" autocomplete="off">

                                            <p id="error-message" style="color: red; display: none;">Please select at least one circumstance.</p>
                                        </fieldset>
                                    </div>

                                </div> */}
                            </FormControl>
                            </div>
                            



                        
                        <Button onClick={closeModal} color="secondary">Close</Button>
                    </div>
                </Fade>
            </Modal>
        </Grid>

        
    );
}
