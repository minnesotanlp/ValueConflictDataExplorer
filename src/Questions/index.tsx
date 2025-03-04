import React, { useState } from 'react';

function ScenarioContainer() {
  const [selectedRank, setSelectedRank] = useState({ option1: '', option2: '', option3: '' });
  const [factors, setFactors] = useState([]);
  const [context, setContext] = useState('');
  const [contextOther, setContextOther] = useState('');
  const [timeUrgency, setTimeUrgency] = useState('');
  const [consequenceLevel, setConsequenceLevel] = useState('');
  const [consequenceReason, setConsequenceReason] = useState('');
  const [strategyRank, setStrategyRank] = useState({
    bestStrategy: '',
    secondBest: '',
    thirdBest: ''
  });
  const [influence, setInfluence] = useState('');
  const [nonAdoptReason, setNonAdoptReason] = useState('');

  const handleSelectRankChange = (event, option) => {
    setSelectedRank({ ...selectedRank, [option]: event.target.value });
  };

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setFactors([...factors, event.target.value]);
    } else {
      setFactors(factors.filter(factor => factor !== event.target.value));
    }
  };

  const handleContextChange = (event) => {
    setContext(event.target.value);
    if (event.target.value !== 'other') {
      setContextOther('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Process form submission here
    console.log("Form data", { selectedRank, factors, context, contextOther, timeUrgency, consequenceLevel, consequenceReason, strategyRank, influence, nonAdoptReason });
  };

  return (
    <div className="scenario_container">
      <form onSubmit={handleSubmit}>
        {/* Scenario ranking selection */}
        <div>
          <label>
            Rank Pair 1:
            <select value={selectedRank.option1} onChange={e => handleSelectRankChange(e, 'option1')}>
              <option value="">Select Rank</option>
              <option value="1">1st</option>
              <option value="2">2nd</option>
              <option value="3">3rd</option>
            </select>
          </label>
          <label>
            Rank Pair 2:
            <select value={selectedRank.option2} onChange={e => handleSelectRankChange(e, 'option2')}>
              <option value="">Select Rank</option>
              <option value="1">1st</option>
              <option value="2">2nd</option>
              <option value="3">3rd</option>
            </select>
          </label>
          <label>
            Rank Pair 3:
            <select value={selectedRank.option3} onChange={e => handleSelectRankChange(e, 'option3')}>
              <option value="">Select Rank</option>
              <option value="1">1st</option>
              <option value="2">2nd</option>
              <option value="3">3rd</option>
            </select>
          </label>
        </div>

        {/* Factors influencing choice */}
        <div>
          <label>



