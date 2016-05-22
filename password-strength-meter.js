import React, {Component,PropTypes} from 'react';
import ReactDom from 'react-dom';
import zxcvbn from 'zxcvbn';

export default class PasswordStrengthMeter extends Component{
  constructor(props){
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.state = {
      resultScore: '',
      warning: '',
      suggestions:''
    };
  }

  handleInput(event){
    event.preventDefault();
    let { strength } = this.props;
    strength = (strength) ? strength : {
      0: "Worst ☹",
      1: "Bad ☹",
      2: "Weak ☹",
      3: "Good ☺",
      4: "Strong ☻"
    }

    const password = ReactDom.findDOMNode(this.refs.password);
    const meter = ReactDom.findDOMNode(this.refs.passwordStrengthMeter);
    const text = ReactDom.findDOMNode(this.refs.passwordStrengthText);

    let val = password.value;
    let result = zxcvbn(val);

    // Update the password strength meter
    meter.value = result.score;

    // Update the text indicator
    if(val !== "") {
        this.setState({
          resultScore:strength[result.score],
          warning:result.feedback.warning,
          suggestions:result.feedback.suggestions
        });
    }
    else {
      this.setState({
        resultScore:'',
        warning:'',
        suggestions:''
      })
    }

    if(typeof this.props.onChange === 'function'){
      this.props.onChange(event);
    }
  }

  render(){
    const { passwordText } = this.props;
    const {hasLabel} = this.props;
    const hasWarningText = this.props.hasWarning ? this.props.warning : null;
    const {className} = this.props;

    const passwordHeader = (passwordText) ? passwordText : 'Enter Password';
    const showLabel = this.props.hasLabel ? 'show' : 'hide';
    let _state = this.state;
    const resultScore = _state.resultScore != undefined ? _state.resultScore : 'Su contraseña es muy fuerte.';
    let warning = '';
    let suggestions = '';
    const {hasSuggestion} = this.state;

    if (hasSuggestion) {
      warning = _state.warning;
      suggestions = _state.suggestions;
    }
    
    return (
      <section>
        <label forHtml="password" className={showLabel}>{passwordHeader}</label>
        <input onInput={this.handleInput} type="password" name="password" id="password" ref="password" className={className} />

        <meter max="4" id="password-strength-meter" ref="passwordStrengthMeter"></meter>
        <p id="password-strength-text" ref="passwordStrengthText">
          {resultScore &&
            "Strength: "}
            <strong>{resultScore}</strong><span className="feedback">{warning + " " + suggestions}</span>
        </p>
        <label className='text-success'>{hasWarningText}</label>
      </section>
    )
  }
}

PasswordStrengthMeter.propTypes = {
  passwordText: React.PropTypes.string,
  hasLabel: React.PropTypes.bool,
  hasWarning: React.PropTypes.bool,
  warning: React.PropTypes.string,
  className: React.PropTypes.any,
  strength: React.PropTypes.object,
  onChange: React.PropTypes.func,
  hasSuggestion: React.PropTypes.bool
}
