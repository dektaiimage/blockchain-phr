import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'react-redux-firebase'
import { Link } from 'react-router-dom'
import CardComponent from './components/card'
import { List } from 'material-ui/List'

import { xrayAction } from './../../redux/actions/xray'
import { patientAction } from './../../redux/actions/patient'
import { CircularProgress, DataNotFound } from './../../components/'

class XrayPage extends Component {
  render() {
    const { patientId, patients, configs, err, xray, healthCareProvider } = { ...this.props }
    console.log(this.props)
    if (isEmpty(xray) && !err) {
      this.props.getAllXray(configs, patientId)
    }
    let renderHTML = (
      <CircularProgress className={`--loadCard`} />
    )
    if (xray.nodata) {
      renderHTML = (
        <DataNotFound />
      )
    } else if (!isEmpty(xray)) {
      renderHTML = (
        <div>
          <div>รายการประวัติ X-Ray: <span>{patients.prename}{patients.name} {patients.surname}</span></div>

          <List>
            {
              xray.map((v, i) => {
                v.healthCareProviderData = healthCareProvider.filter((Provider) => {
                  return Provider.healthCareProviderId === v.healthCareProviderId
                })
                return (
                  <div key={v.assetId}>
                    <Link to={{
                      pathname: `/xray/${v.assetId}`,
                      state: { data: v }
                    }}> <CardComponent data={v} /> </Link>
                  </div>
                )
              })
            }
          </List>
        </div>
      )
    }
    return (
      <div className={`containerMain`}>
        <div className={`card`}>
          {renderHTML}
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, state) => {
  return {
    getAllXray: (configs, patientId) => {
      dispatch(xrayAction.getAllXray(configs, patientId))
    }
  }
}

const mapStateToProps = state => (
  {
    patientId: state.firebase.profile.patientId,
    patients: state.patient.data,
    configs: state.firebase.data.configs,
    err: state.fetchError.modalOpen,
    xray: state.xray.data,
    healthCareProvider: state.healthCareProvider.data
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(XrayPage)