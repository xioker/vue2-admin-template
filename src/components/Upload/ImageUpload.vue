<template>
  <div>
    <el-upload
      action=""
      list-type="picture-card"
      :show-file-list="false"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="onChange"
      v-bind="$attrs"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="comUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { uploadFile } from '@/api/common'
export default {
  name: 'ImageUpload',
  props: {
    url: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {},
      required: true,
      validator: (val) => {
        return ('type' in val) && ('module' in val)
      }
    }
  },
  computed: {
    comUrl:{
      get(){
        return this.url
      },
      set(val){
        return this.$emit('update:url', val)
      }
    }
  },
  data(){
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    // type1.图片，2.视频 ，3.文件 4.其他 
    // module2:用户头像;3:首页banner;4:站内信;5:活动6:主题
    onChange(file){
      const { type, module  } = this.params
      let formData = new FormData();
      formData.append('file', file.raw);
      formData.append('type', type);
      formData.append('module', module);
      console.log(file)
      uploadFile(formData).then((res)=>{
        console.log(res)
        this.comUrl = res
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
}
</script>
<style lang="scss" scoped>
  
</style>