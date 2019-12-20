// 无状态组件
import React from 'react';
import { Input, Button, List } from 'antd';

const TodoListUI = (props) => {
  return (
    <div style={{ width: 500, margin: '0 auto', padding: '100px 0' }}>
      <div style={{ display: 'flex' }}>
        <Input placeholder={props.inputValue} value={props.inputValue} onChange={props.changeInputValue} />
        <Button type="primary" style={{ marginLeft: '20px' }} onClick={props.clickBtn}>增加</Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <List
          loading={props.loadingList}
          bordered
          dataSource={props.list}
          renderItem={(item, index) => (
            <List.Item onClick={() => { props.deleteItem(index) }}>
              {item}
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}
 
// class TodoListUI extends Component {
//   constructor(props) {
//     super(props);
//   }
//   render() { 
//     return (
//       <div style={{ width: 500, margin: '0 auto', padding: '100px 0'}}>
//         <div style={{display: 'flex'}}>
//           <Input placeholder={this.props.inputValue} value={this.props.inputValue} onChange={this.props.changeInputValue} />
//           <Button type="primary" style={{ marginLeft: '20px' }} onClick={this.props.clickBtn}>增加</Button>
//         </div>
//         <div style={{marginTop: '20px'}}>
//           <List
//             bordered
//             dataSource={this.props.list}
//             renderItem={(item, index) => (
//               <List.Item onClick={() => {this.props.deleteItem(index)} }>
//                 {item}
//               </List.Item>
//             )}
//           />
//         </div>
//       </div>
//     )
//   }
// }
 
export default TodoListUI;