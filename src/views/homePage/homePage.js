import homeHeader from '@/components/homeHeader';
import {post} from '@/api';
export default {
    name: 'home',
    components: {
        homeHeader
    },
    props: [],
    data(){
        return{
            dialog: false,
            classRoom: [],
            defaultRoomNo: 0,
            removeSeat: 0,
            totalRow: 0,
            totalCol: 0,
            edit: false,
            headers: [
                {
                    text: '教室', 
                    align:'start', 
                    value: 'roomNo',
                    sortable: false
                },
                {
                    text: '橫排數', 
                    align:'start', 
                    value: 'totalRow',
                    sortable: false
                },
                {
                    text: '直列數', 
                    align:'start', 
                    value: 'totalCol',
                    sortable: false
                },
                {
                    text: '走道', 
                    align:'start', 
                    value: 'aisle',
                    sortable: false
                },
                {
                    text: '預期座位數', 
                    align:'start', 
                    value: 'finalSeat',
                    sortable: false
                },
                {
                    text: '', 
                    align:'start', 
                    value:'actions', 
                    sortable: false
                },
            ],
            rules: {
                required: value => !!value || '必填',
                digits: value => /^\+?[1-9][0-9]*$/.test(value)||'請輸入大於零的整數'
            },
            // for diagram
            matrix: [],
            isShowDiagram: false,
            diagramRow: 0,
            diagramCol: 0,
            diagramDialog: false,
            // for學生清單
            defaultButtonText: '上傳學生清單',
            selectedFile: null,
            isSelecting: false,
            formData: undefined,
            // for是否成功下載
            isSubmit: false,
            
        }
    },
    computed: {
        buttonText() {
            return this.selectedFile ? this.selectedFile.name : this.defaultButtonText
        }
    },
    async mounted() {
        this.mounted()
    },
    methods: {
        mounted() {
        },
        addClassRoom() {
            const tmp = {
                room: {
                    key: this.defaultRoomNo
                },
                form: {
                    roomNo: undefined,
                    totalRow: undefined,
                    totalCol: undefined,
                    finalSeat: undefined,
                    diagram: undefined,
                }
            }
            this.classRoom = [...this.classRoom,tmp];
            this.editClassRoom(tmp);
        },
        editClassRoom(item) {
            this.$set(item, 'edit', true); // 對edit屬性賦值true
            this.edit = true;
        },
        confirmAddRoom(item) {
            this.classRoom.pop();
            this.$set(item.form, 'edit', false);
            this.totalRow = item.form.totalRow;
            this.totalCol = item.form.totalCol;
            this.finalSeat = item.form.finalSeat;          
            this.aisle = item.form.aisle.split(',').map( Number );
            this.$set(item.form, 'finalSeat', this.finalSeat)
            this.diagram = this.caculate(this.totalRow, this.totalCol, this.finalSeat, this.aisle);
            this.$set(item.form, 'diagram', this.diagram)

            this.classRoom.push(item.form);
            this.edit = false;
            
        },
        reset() {
            this.classRoom.pop();
            this.edit = false;
        },
        caculate(row, col, finalSeat, aisle) {
            let tempMap = [];
            let temp = {};
            let nowSeat = 0;
            let round = 0;
            
            for(var i = 0; i < row; i++){
                for(var j = 0; j < col; j++){
                    if(round==0){
                            if(i%2==0){
                                if(j%2==0){
                                    if(aisle.includes(j+1)){
                                        temp = {
                                            row:i,
                                            col:j,
                                            status:-1 //不可用，走道
                                        }
                                    }
                                    else{
                                        temp = {
                                            row:i,
                                            col:j,
                                            status:1 //可用
                                        }
                                        nowSeat = nowSeat + 1; 

                                    }
                                    
                                }
                                else{
                                    if(aisle.includes(j+1)){
                                        temp = {
                                            row:i,
                                            col:j,
                                            status:-1 //不可用，走道
                                        }
                                    }else{
                                        temp = {
                                            row:i,
                                            col:j,
                                            status:0 //不可用
                                        }

                                    }
 
                                    
                                }
                                tempMap.push(temp);
                                
                            }else{
                                if(j%2==0){
                                    if(aisle.includes(j+1)){
                                        temp = {
                                            row:i,
                                            col:j,
                                            status:-1 //不可用，走道
                                        }
                                    }else{
                                        temp = {
                                            row:i,
                                            col:j,
                                            status:0 //不可用
                                        }

                                    }
                                }
                                else{
                                    if(aisle.includes(j+1)){
                                        temp = {
                                            row:i,
                                            col:j,
                                            status:-1 //不可用，走道
                                        }
                                    }
                                    else{
                                        temp = {
                                            row:i,
                                            col:j,
                                            status:1 //可用
                                        }
                                        nowSeat = nowSeat + 1; 

                                    }
                                }
                                tempMap.push(temp);
                                
    
                            }
                    }
                    
                }
            }
            if(nowSeat<finalSeat){
                for(var index = 0; index < tempMap.length; index++){
                    if(!aisle.includes(tempMap[index].col+1) && tempMap[index].status==0){
                        tempMap[index].status = 1 
                        nowSeat = nowSeat + 1;
                        if(nowSeat>=finalSeat){
                            break;
                        }
                                
                    } 
                }
                
            }
            return tempMap;     
        },
        showDiagram(item){
            this.diagramDialog = true;
            this.matrix = item.diagram;
            this.diagramRow = item.totalRow;
            this.diagramCol = item.totalCol;
            let columns = []
            let mid = Math.ceil(item.diagram.length / this.diagramRow)
            for (let col = 0; col < this.diagramRow; col++) {
                columns.push(item.diagram.slice(col * mid, col * mid + mid))
            }
            this.matrix = columns;
            
            this.isShowDiagram = !this.isShowDiagram;
        },
        bindClass(item){
            if(item.status==0){
                return "seatNoUse"
            }
            else if(item.status==1){
                return "seatActive"
            }
            else{
                return "seatAisle"
            }
        },
        onButtonClick() {
            this.isSelecting = true
            window.addEventListener('focus', () => {
              this.isSelecting = false
            }, { once: true })
      
            this.$refs.uploader.click()
        },
        onFileChanged(e) {
            this.selectedFile = e.target.files[0]
        },
        async submit() {
            if (this.classRoom.length == 0) {
                alert("請設定座位表！")
                return;
            }
            if (this.selectedFile === null) {
                alert("請上傳學生清單！")
                return;
            }
            // eslint-disable-next-line
            const postData = this.classRoom.map(({edit, aisle, ...rest}) => {
                return rest;
            });
            this.formData = new FormData();
            this.formData.append('file', this.selectedFile);
            this.formData.append('classRooms', JSON.stringify(postData));
            let config = {
                'formType':'formData',
                'responseType':'blob',
            }

            post('/submit', this.formData, config)
                .then((result) => {
                    let objectUrl = URL.createObjectURL(result) // 創建url
                    location.href = objectUrl;
                    URL.revokeObjectURL(objectUrl); // 釋放內存
                    this.isSubmit = true;
                }
            )
        }
        
        
    }
    
};