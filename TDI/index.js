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
    
  get activity() {
    return this.transplantProb + this.deathProb;
  }

  get tdi() {
    return 0.01 * (this.transplantProb - this.deathProb);
  }

  get tdiGroup() {
      const tdi = this.tdi;
      if (tdi <= 0.01854) {
          return 10;
      } else if (tdi <= 0.124603) {
          return 20;
      } else if (tdi <= 0.1805982) {
          return 30;
      } else if (tdi <= 0.2167774) {
          return 40;
      } else if (tdi <= 0.2469282) {
          return 50;
      } else if (tdi <= 0.2790264) {
          return 60;
      } else if (tdi <= 0.316831) {
          return 70;
      } else if (tdi <= 0.3692073) {
          return 80;
      } else if (tdi <= 0.4537375) {
          return 90;
      } else {
          return '91+';
      }
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
              elm('div', { id: 'rawTDI', className: 'single-result'}, [
                elm('h4', null, 'Raw Value'),
                elm('h1', null, this.formatValue(this.tdi))
              ]),
              elm('div', { id: 'tdiGroup', className: 'single-result'}, [
                elm('h4', null, 'Transplant Death Index'),
                elm('h1', null, 'TDI' + this.tdiGroup)
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
