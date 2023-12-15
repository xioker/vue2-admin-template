<template>
  <div>
    <!-- <el-upload
      ref="upload"
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :auto-upload="false"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="onChange"
      v-bind="$attrs"
    >
      <i class="el-icon-plus"></i>
    </el-upload> -->
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :auto-upload="false"
      :on-change="onChange">
      <img v-if="comUrl" :src="comUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-dialog append-to-body destroy-on-close :visible.sync="dialogVisible">
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
        if(this.url && this.url.indexOf('http') != -1){
          return this.url
        }else{
          return this.url  ?  'http://8.130.37.133:8888/pc-api' + this.url : ''
        }
      },
      set(val){
        return this.$emit('update:url', val)
      }
    },
    fileList(){
      return this.params.type === 1 && this.url ? [{ url: this.comUrl }] : []
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
  ::v-deep.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
    
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>