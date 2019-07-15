import React, { memo, useState, useRef, useEffect } from "react"
import { useSelector } from "react-redux"
import { graphql } from "gatsby"
import styled, { createGlobalStyle } from "styled-components"
import uuid from "uuid"

import _ from "lodash"
import * as moment from "moment"

import * as Colors from "consts/Colors"
import { rhythm } from "src/utils/typography"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Icons, usePrevious, useMeasure, Tree } from "components/Pages/FileTree"

// prettier-ignore
const MOCK_DATA = [
  {moment: moment('2019-07-04 06:30:00'), name: "Wake up", id: uuid()},
  {moment: moment('2019-07-04 10:00:00'), name: "Drive to the Gunks", id: uuid()},
  {moment: moment('2019-07-04 16:30:00'), name: "Eat at Mitsuwa", id: uuid()},
  {moment: moment('2019-07-05 09:30:00'), name: "Arrive at work", id: uuid()},
  {moment: moment('2019-07-05 18:30:00'), name: "Leave work", id: uuid()},
  {moment: moment('2019-07-06 14:35:00'), name: "Drive to the Cliffs", id: uuid()},
  {moment: moment('2019-07-06 15:30:00'), name: "Breville", id: uuid()},
];

const Canvas = styled.div`
  background: ${props =>
    props.isDarkMode ? Colors.blackLighter : Colors.blackLight};
  border-radius: 10px;
  padding: ${rhythm(2)} ${rhythm(2)} ${rhythm(2)};
`

const FileTree = props => {
  const { data } = props
  const siteTitle = data.site.siteMetadata.title

  const [mockData, setMockData] = useState(MOCK_DATA)
  const isDarkMode = useSelector(state => state.isDarkMode)
  const [date, setDate] = useState(moment())

  const [value, setValue] = useState("")
  const _handleChange = e => {
    setValue(e.target.value)
  }
  const addToData = e => {
    e.preventDefault()
    console.log("e", e)
    let foo = { moment: moment(), name: value }
    setMockData(prev => prev.concat(foo))
    setValue("")
  }

  const _handleDelete = e => {
    setMockData(items => items.filter(e => e.id !== item.id))
  }

  // TODO: simulate device shake, and toggle `isDarkMode`
  useEffect(() => {
    function handleMotionEvent(event) {
      var x = event.accelerationIncludingGravity.x
      var y = event.accelerationIncludingGravity.y
      var z = event.accelerationIncludingGravity.z
      console.log(`${x} ${y} ${z}`)
    }
    window.addEventListener("devicemotion", handleMotionEvent, true)
  }, [])

  /**
   * GROUPED_DATA
   * Use `_.groupBy` to group
   */
  const GROUPED_DATA = _.groupBy(mockData, ({ moment }) =>
    moment.format("dddd - MMMM Do YYYY")
  )
  // console.log(GROUPED_DATA)

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO title="File Tree Demo" />
      <h1>Tree Demo</h1>
      <Canvas isDarkMode={isDarkMode}>
        {/**
         * map through the keys of GROUPED_DATA
         */}
        {Object.keys(GROUPED_DATA).map((e: String, i: Number) => {
          // console.log("mapped", e)
          return (
            <Tree name={e} key={i}>
              {GROUPED_DATA[e].map(({ moment, name, id }, index) => {
                return (
                  <Tree name={moment.format("h:mm:ss a")} key={index}>
                    <Tree
                      name={name}
                      editable
                      onClick={e => {
                        setMockData(data => data.filter(each => each.id !== id))
                      }}
                    />
                  </Tree>
                )
              })}
            </Tree>
          )
        })}
        <Tree name={"Add a note"}>
          <Form onSubmit={addToData}>
            <input
              type="text"
              name="name"
              value={value}
              onChange={_handleChange}
              autocomplete="off"
            />
            <input type="submit" value="Save" />
          </Form>
        </Tree>
      </Canvas>
    </Layout>
  )
}

export default FileTree

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 200px;

  input {
    background: ${Colors.blackDark};
    border: none;
    color: ${Colors.silverLight};
    margin-bottom: 3px;
    auto
  }
`
