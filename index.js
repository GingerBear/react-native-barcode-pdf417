import React, { Component } from "react";
import PropTypes from "prop-types";
import { ART, Text, View, ActivityIndicator, StyleSheet } from "react-native";

const { Group, Shape, Surface } = ART;
import createPDF417 from "./lib/pdf417-min";

export default class RNPDF417 extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  };

  state = {
    isLoading: true
  };

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({
        isLoading: false
      });
    });
  }

  render() {
    const { width, height, text } = this.props;

    if (this.state.isLoading) {
      return (
        <View style={[S.loadingContainer, { width, height }]}>
          <ActivityIndicator style={S.loadingIndicator} />
        </View>
      );
    }

    const PDF417 = createPDF417();

    PDF417.init(text);
    const barcode = PDF417.getBarcodeArray();

    const w = width / barcode.num_cols;
    const h = height / barcode.num_rows;
    const shapes = [];

    barcode.bcode.forEach((line, i) => {
      line.forEach((code, j) => {
        if (code === "1") {
          shapes.push(
            `M ${j * w} ${i * h} h ${w} v ${h} h -${w} L ${j * w} ${i * h}`
          );
        }
      });
    });

    return (
      <Surface width={width} height={height}>
        <Group x={0} y={0}>
          <Shape d={shapes} fill="#000000" />
        </Group>
      </Surface>
    );
  }
}

const S = StyleSheet.create({
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  loadingIndicator: {
    marginRight: 10
  }
});
