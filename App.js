import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';

var DOMParser = require('xmldom').DOMParser;
export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Ticks />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  table: {
    width: 250
  }
});

class Ticks extends React.Component {
    fetchTicks() {
        var self = this;
        fetch("https://quotes.instaforex.com/api/quotesTick")
        .then(result => result.text())
        .catch(function(error) { if (error) {
            self.setState({
                rows: [],
                time: Date.now()
            });
        }})
        .then(result => {
            if (result) {
                var xmlDoc = this.parser.parseFromString(result, "text/xml");
                var items = xmlDoc.getElementsByTagName('item');
                var rows = [];
                for (var i=0;i<items.length;i++) {
                    var symbol = items[i].getElementsByTagName('symbol')[0].childNodes[0].nodeValue;
                    var ask = items[i].getElementsByTagName('ask')[0].childNodes[0].nodeValue;
                    var bid = items[i].getElementsByTagName('bid')[0].childNodes[0].nodeValue;
                    var change = items[i].getElementsByTagName('change')[0].childNodes[0].nodeValue;
                    var direction = change * 1 >= 0 ? 'Up' : 'Down';
                    rows.push(<Row key={i} data={[symbol, ask, bid, direction]} />);
                }
                this.setState({
                    rows: rows,
                    time: Date.now()
                });
            }
        });
    }
    componentDidMount() {
        this.fetchTicks();
        this.interval = setInterval(() => this.fetchTicks(), 5000);
    }
    componentWillUnmount() {
      clearInterval(this.interval);
    }
    constructor(){
        super();
        this.parser = new DOMParser();
        this.state = {
            rows: [],
            time: Date.now()
        };
    }
    render() {
        return (
            <View>
                <Text>{this.state.time}</Text>
                <Table style={styles.table}>
                    <Row data={['Symbol name', 'Ask', 'Bid', 'Direction']} />
                    {this.state.rows}
                </Table>
            </View>
        )
    }
}
