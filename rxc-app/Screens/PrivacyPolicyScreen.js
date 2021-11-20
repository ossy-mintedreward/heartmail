import * as React from 'react'
import CustomCard from '../Components/CustomCard'
import db from '../db/db.js'
import { ScrollView, View } from 'react-native'
import Heart from '../Components/Heart'

const articles = db.filter(obj => obj.filename === 'privacy-policy.md')

const PrivacyPolicyScreen = () => {
  return (
    <React.Fragment>
      <ScrollView style={{ backgroundColor: 'white' }}>
        {articles.map((ele) => (
          <CustomCard
            key={ele.filename}
            date={ele.date}
            author={ele.metadata.author}
            title={ele.metadata.title}
            content={ele.content}
          />
        ))}
        <View style={{alignItems: 'center'}}>
          <Heart width={50} height={50} />
        </View>
      </ScrollView>
    </React.Fragment>
  )
}

export default PrivacyPolicyScreen