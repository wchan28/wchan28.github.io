const fields = [
  {
    "title": "Initial MELD score",
    "id": "meld",
    "type": "number",
    "initialValue": 0
  },
  {
    "title": "Age",
    "id": "age",
    "type": "number",
    "initialValue": 0
  },
  {
    "title": "BMI",
    "id": "bmi",
    "type": "number",
    "initialValue": 0
  },
  {
    "title": "Diagnosis",
    "id": "diagnosis",
    "type": "category",
    "options": [
      "Select",
      "Alcoholic liver disease",
      "Nonalcoholic steatohepatitis",
      "Autoimmune hepatitis",
      "Hepatitis C"
    ],
    "initialValue": "Select"
  },
  {
    "title": "Life support",
    "id": "lifesup",
    "type": "boolean",
    "initialValue": false
  },
  {
    "title": "Diabetes mellitus",
    "id": "diabetes",
    "type": "boolean",
    "initialValue": false
  },
  {
    "title": "TIPS",
    "id": "tips",
    "type": "boolean",
    "initialValue": false
  },
  {
    "title": "Retransplant",
    "id": "retransplant",
    "type": "boolean",
    "initialValue": false
  },
  {
    "title": "Region",
    "id": "region",
    "type": "category",
    "options": [
      "Select","1","2","3","5","6","9","10","11"
    ],
    "initialValue": "Select"
  },
  {
    "title": "Spontaneous bacterial peritonitis",
    "id": "sbp",
    "type": "boolean",
    "initialValue": false
  },
  {
    "title": "ABO blood group",
    "id": "abo",
    "type": "category",
    "options": [
      "Select",
      "O",
      "A",
      "B",
      "AB"
    ],
    "initialValue": "Select"
  },
  {
    "title": "Hemodialysis",
    "id": "hemodialysis",
    "type": "boolean",
    "initialValue": false
  }
];

const elm = (el, props, children) => { return React.createElement(el, props, children); }

// props: field spec & value & onChange
const Field = (props) => {
  switch (props.type) {
    case 'number':
      return elm('div', { className: 'form-group' }, [
        elm('label', { for: props.id }, props.title),
        elm('input', {
          id: props.id,
          className: 'form-control',
          type: 'number',
          value: props.value,
          onChange: (e) => props.onChange(parseFloat(e.target.value)),
        })
      ]);
    case 'boolean':
      return elm('div', { className: 'form-check' }, [
        elm('input', {
          id: props.id,
          className: 'form-check-input',
          type: 'checkbox',
          checked: props.value,
          onChange: (e) => props.onChange(e.target.checked),
        }),
        elm('label', { for: props.id }, props.title),
      ]);
    case 'category':
      return elm('div', { className: 'form-group' }, [
        elm('label', { for: props.id }, props.title),
        elm('select', {
          id: props.id,
          className: 'form-control',
          type: 'number',
          value: props.value,
          onChange: (e) => props.onChange(e.target.value),
        }, props.options.map(option => {
          return elm('option', { value: option }, option);
        }))
      ]);
  }
}

const stateFromFields = (fields) => {
  const stateFromField = (field) => {
    switch (field.type) {
      case 'number':
        return field.initialValue;
      case 'category':
        return field.initialValue;
      case 'boolean':
        return field.initialValue;
    }
  }

  return fields.reduce((prev, curr) => {
    prev[curr.id] = stateFromField(curr);
    return prev;
  }, {});
}

const cToN = (value, pick) => {
  return value === pick ? 1 : 0;
}

const bToN = (value) => {
  return value ? 1 : 0;
}

class App extends React.Component {
  constructor() {
    super()
    this.state = stateFromFields(fields);
  }

  get transplantProb() {
    return 100 * (1 - (
      -0.06884813 *
      (
         0.07789 * this.state.meld +
        -0.00323 * this.state.age +
         0.0029  * this.state.bmi +
        -0.03139 * cToN(this.state.diagnosis, 'Alcoholic liver disease') +
        -0.11027 * cToN(this.state.diagnosis, 'Autoimmune hepatitis') +
        -0.03094 * cToN(this.state.diagnosis, 'Hepatitis C') +
        -0.36045 * bToN(this.state.lifesup) +
        -0.02663 * bToN(this.state.diabetes) +
        -0.04604 * bToN(this.state.tips) +
         0.05555 * bToN(this.state.retransplant) +
        -0.36697 * cToN(this.state.region, "1") +
        -0.05274 * cToN(this.state.region, "2") +
         0.72046 * cToN(this.state.region, "3") +
        -0.28353 * cToN(this.state.region, "5") +
         0.15117 * cToN(this.state.region, "6") +
        -0.37769 * cToN(this.state.region, "9") +
         0.50982 * cToN(this.state.region, "10") +
         0.41451 * cToN(this.state.region, "11") +
         0.16968 * bToN(this.state.sbp) +
         0.74550 * cToN(this.state.abo, "AB") +
         0.22415 * cToN(this.state.abo, "B") +
        -0.04237 * cToN(this.state.abo, "O") +
        -0.24775 * bToN(this.state.hemodialysis)
      )
    ));
  }

  get deathProb() {
    return 100 * (1 - (
      -0.002785479 *
      (
         0.0966224 * this.state.meld +
         0.0236356 * this.state.age +
        -0.0760382 * cToN(this.state.diagnosis, 'Alcoholic liver disease')  +
        -0.1348595 * cToN(this.state.diagnosis, 'Nonalcoholic steatohepatitis') +
         0.1004834 * cToN(this.state.diagnosis, 'Hepatitis C') +
         0.9297618 * bToN(this.state.lifesup) +
         0.0924785 * bToN(this.state.diabetes)  +
        -0.1385824 * bToN(this.state.tips) +
         0.0276309 * bToN(this.state.retransplant)  +
         0.1628267 * cToN(this.state.region, "1") +
         0.1592703 * cToN(this.state.region, "2") +
         0.0407678 * cToN(this.state.region, "3") +
         0.0238289 * cToN(this.state.region, "5") +
        -0.2426165 * cToN(this.state.region, "6") +
         0.3566405 * cToN(this.state.region, "9") +
         0.1604965 * cToN(this.state.region, "10") +
         0.2465154 * cToN(this.state.region, "11") +
         0.1777921 * bToN(this.state.sbp) +
        -0.1672138 * cToN(this.state.abo, "AB") +
        -0.0989104 * cToN(this.state.abo, "B")  +
         0.0002113 * cToN(this.state.abo, "O") +
         0.3852846 * bToN(this.state.hemodialysis)
      )
    ));
  }
    
  get inactive() {
      const activity = 0.01 * (this.transplantProb + this.deathProb);
      return activity < 0.1;
  }

  get tdi() {
      return 0.01 * (this.transplantProb - this.deathProb);
  }

  get tdiGroup() {
      const tdi = this.tdi;
      //const inactive = this.inactive();
//      if (tdi <= 0.01854) {
//          return 10;
//      } else if (tdi <= 0.124603) {
//          return 20;
//      } else if (tdi <= 0.1805982) {
//          return 30;
//      } else if (tdi <= 0.2167774) {
//          return 40;
//      } else if (tdi <= 0.2469282) {
//          return 50;
//      } else if (tdi <= 0.2790264) {
//          return 60;
//      } else if (tdi <= 0.316831) {
//          return 70;
//      } else if (tdi <= 0.3692073) {
//          return 80;
//      } else if (tdi <= 0.4537375) {
//          return 90;
//      } else {
//          return '91+';
//      }
      if (tdi < 0.2994058) return 'TDI-Inactive';
      else if (tdi === 0) return 0;
      else if (tdi <= -0.2597767) return 1;
      else if (tdi <= -0.136424) return 2;
      else if (tdi <= -0.0573148) return 3;
      else if (tdi <= -0.0101795) return 4;
      else if (tdi <= 0.0164581) return 5;
      else if (tdi <= 0.028713) return 6;
      else if (tdi <= 0.0354493) return 7;
      else if (tdi <= 0.0404668) return 8;
      else if (tdi <= 0.0446771) return 9;
      else if (tdi <= 0.0483575) return 10;
      else if (tdi <= 0.0513819) return 11;
      else if (tdi <= 0.0544827) return 12;
      else if (tdi <= 0.0573232) return 13;
      else if (tdi <= 0.0598484) return 14;
      else if (tdi <= 0.0623588) return 15;
      else if (tdi <= 0.0647216) return 16;
      else if (tdi <= 0.0671653) return 17;
      else if (tdi <= 0.0695127) return 18;
      else if (tdi <= 0.0715845) return 19;
      else if (tdi <= 0.0737915) return 20;
      else if (tdi <= 0.075971) return 21;
      else if (tdi <= 0.0780752) return 22;
      else if (tdi <= 0.0800339) return 23;
      else if (tdi <= 0.0820574) return 24;
      else if (tdi <= 0.0841172) return 25;
      else if (tdi <= 0.0859993) return 26;
      else if (tdi <= 0.0880165) return 27;
      else if (tdi <= 0.0900765) return 28;
      else if (tdi <= 0.0922587) return 29;
      else if (tdi <= 0.0945699) return 30;
      else if (tdi <= 0.0966986) return 31;
      else if (tdi <= 0.0988747) return 32;
      else if (tdi <= 0.1009953) return 33;
      else if (tdi <= 0.1032798) return 34;
      else if (tdi <= 0.1055093) return 35;
      else if (tdi <= 0.107779) return 36;
      else if (tdi <= 0.1101479) return 37;
      else if (tdi <= 0.1125028) return 38;
      else if (tdi <= 0.1148934) return 39;
      else if (tdi <= 0.1171808) return 40;
      else if (tdi <= 0.1196289) return 41;
      else if (tdi <= 0.1222986) return 42;
      else if (tdi <= 0.1248775) return 43;
      else if (tdi <= 0.1274446) return 44;
      else if (tdi <= 0.1300384) return 45;
      else if (tdi <= 0.1328166) return 46;
      else if (tdi <= 0.1356074) return 47;
      else if (tdi <= 0.138534) return 48;
      else if (tdi <= 0.1414953) return 49;
      else if (tdi <= 0.1446257) return 50;
      else if (tdi <= 0.1478114) return 51;
      else if (tdi <= 0.1508206) return 52;
      else if (tdi <= 0.1542356) return 53;
      else if (tdi <= 0.1575198) return 54;
      else if (tdi <= 0.1608561) return 55;
      else if (tdi <= 0.1644011) return 56;
      else if (tdi <= 0.1680036) return 57;
      else if (tdi <= 0.1716054) return 58;
      else if (tdi <= 0.1750717) return 59;
      else if (tdi <= 0.178903) return 60;
      else if (tdi <= 0.1827655) return 61;
      else if (tdi <= 0.186821) return 62;
      else if (tdi <= 0.1909725) return 63;
      else if (tdi <= 0.1951116) return 64;
      else if (tdi <= 0.1996326) return 65;
      else if (tdi <= 0.203973) return 66;
      else if (tdi <= 0.2083537) return 67;
      else if (tdi <= 0.2133297) return 68;
      else if (tdi <= 0.2183462) return 69;
      else if (tdi <= 0.2233566) return 70;
      else if (tdi <= 0.2285208) return 71;
      else if (tdi <= 0.2337445) return 72;
      else if (tdi <= 0.2388269) return 73;
      else if (tdi <= 0.2443872) return 74;
      else if (tdi <= 0.2501739) return 75;
      else if (tdi <= 0.2562084) return 76;
      else if (tdi <= 0.2624519) return 77;
      else if (tdi <= 0.2690509) return 78;
      else if (tdi <= 0.2758383) return 79;
      else if (tdi <= 0.2825647) return 80;
      else if (tdi <= 0.2891416) return 81;
      else if (tdi <= 0.2967634) return 82;
      else if (tdi <= 0.3048085) return 83;
      else if (tdi <= 0.3130734) return 84;
      else if (tdi <= 0.3215401) return 85;
      else if (tdi <= 0.3306713) return 86;
      else if (tdi <= 0.3404457) return 87;
      else if (tdi <= 0.3511929) return 88;
      else if (tdi <= 0.3620806) return 89;
      else if (tdi <= 0.374723) return 90;
      else if (tdi <= 0.3888265) return 91;
      else if (tdi <= 0.4034167) return 92;
      else if (tdi <= 0.4208109) return 93;
      else if (tdi <= 0.4395221) return 94;
      else if (tdi <= 0.4623245) return 95;
      else if (tdi <= 0.4879236) return 96;
      else if (tdi <= 0.5187594) return 97;
      else if (tdi <= 0.5563703) return 98;
      else if (tdi <= 0.6146271) return 99;
      else if (tdi > 0.6146271)return 100;
      else return 0;
  }

  render() {
    return elm('div',
      { className: 'container' },
      elm('div',
        { className: 'row' }, [
          elm('section',
            { id: 'inputs', className: 'col-md' },
            [
              elm('h1', null, 'Inputs'),
              fields.map(field => elm(Field, Object.assign({}, field, {
                value: this.state[field.id],
                onChange: (value) => this.handleInputUpdate(field.id, value)
              })))
            ]
          ),
          elm('section',
            { id: 'results', className: 'col-md' },
            [
              elm('h1', null, 'Results'),
//              elm('div', { id: 'rawTDI', className: 'single-result'}, [
//                elm('h4', null, 'Raw Value'),
//                elm('h1', null, this.formatValue(this.tdi))
//              ]),
              elm('div', { id: 'tdiGroup', className: 'single-result'}, [
                elm('h4', null, 'Transplant Death Index'),
                elm('h1', null, this.tdiGroup)
              ]),
//              elm('div', { id: 'p-transplant', className: 'single-result'}, [
//                elm('h4', null, 'pTransplant'),
//                elm('h1', null, this.formatValue(this.transplantProb) + '%')
//              ]),
//              elm('div', { id: 'p-death', className: 'single-result'}, [
//                elm('h4', null, 'pDeath'),
//                elm('h1', null, this.formatValue(this.deathProb) + '%')
//              ]),
//              elm('div', { id: 'p-activity', className: 'single-result'}, [
//                elm('h4', null, 'pActivity'),
//                elm('h1', null, this.formatValue(this.activity) + '%')
//              ]),
              elm('img', { src: 'chart.png', className: 'img-fluid' })
            ]
          )
        ]
      )
    );
  }

  handleInputUpdate(id, value) {
    this.setState({
      [id]: value
    });
  }

  formatValue(value) {
    return value.toFixed(3);
  }
}

ReactDOM.render(
  elm(App, null, null),
  document.getElementById('root')
);
