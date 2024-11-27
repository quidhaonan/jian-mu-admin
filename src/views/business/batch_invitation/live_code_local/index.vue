<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
      <el-form-item label="活码名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入活码名称"
            clearable
            style="width: 240px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
            v-model="queryParams.status"
            placeholder="角色状态"
            clearable
            style="width: 240px"
        >
          <el-option
              v-for="dict in sys_normal_disable"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" style="width: 308px">
        <el-date-picker
            v-model="dateRange"
            value-format="YYYY-MM-DD hh:mm:ss"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['system:role:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:role:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:role:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['system:role:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="活码编号" prop="id" width="50"/>
      <el-table-column label="活码名称" prop="name" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="访问链接" prop="url" :show-overflow-tooltip="true" width="400">
        <template #default="scope">
          <div class="url-cell">
            <span class="url-text">{{ scope.row.url }}</span>
            <el-button
                type="text"
                size="mini"
                @click="copyToClipboard(scope.row.url)"
            >
              复制
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="查看次数" prop="viewedCount" width="80"/>
      <el-table-column label="状态" align="center" width="70">
        <template #default="scope">
          <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" width="150"/>
      <el-table-column label="更新时间" align="center" prop="createTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip content="修改" placement="top">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                       v-hasPermi="['system:role:edit']"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                       v-hasPermi="['system:role:remove']"></el-button>
          </el-tooltip>
          <!--          <el-tooltip content="数据权限" placement="top" v-if="scope.row.id !== 1">-->
          <!--            <el-button link type="primary" icon="CircleCheck" @click="handleDataScope(scope.row)"-->
          <!--                       v-hasPermi="['system:role:edit']"></el-button>-->
          <!--          </el-tooltip>-->
          <!--          <el-tooltip content="分配用户" placement="top" v-if="scope.row.id !== 1">-->
          <!--            <el-button link type="primary" icon="User" @click="handleAuthUser(scope.row)"-->
          <!--                       v-hasPermi="['system:role:edit']"></el-button>-->
          <!--          </el-tooltip>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="liveCodeLocalRef" :model="form" :rules="rules" label-width="150px" enctype=“multipart/form-data”>
        <el-form-item label="活码名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入活码名称"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in sys_normal_disable"
                :key="dict.value"
                :value="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图片">
          <!--          :http-request="submitForm"-->
          <el-upload
              list-type="picture-card"
              class="upload-demo"
              drag
              multiple
              :on-change="changeFile"
              :auto-upload="false"
              :limit="1"
              :on-exceed="handleExceed"
              ref="uploadFile"
          >
            <!--            :data="uploadForm.data"-->
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
            <!--            <div class="el-upload__text">-->
            <!--              Drop file here or <em>click to upload</em>-->
            <!--            </div>-->
          </el-upload>
          <!--          <el-upload-->
          <!--              :on-preview="previewFile"-->
          <!--              limit="1"-->
          <!--              :on-change="changeFile"-->
          <!--              :auto-upload="false"-->
          <!--              :data="uploadForm.data">-->
          <!--            <el-icon class="el-icon&#45;&#45;upload">-->
          <!--              <upload-filled/>-->
          <!--            </el-icon>-->
          <!--            <div class="el-upload__text">-->
          <!--              Drop file here or <em>click to upload</em>-->
          <!--            </div>-->
          <!--            &lt;!&ndash;          <el-button style="margin-left: 10px;" size="small" type="success"&ndash;&gt;-->
          <!--            &lt;!&ndash;                     @click="submitUpload">上传到服务器</el-button>&ndash;&gt;-->
          <!--          </el-upload>-->
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" v-model="openDataScope" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="活码名称">
          <el-input v-model="form.name" :disabled="true"/>
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.roleKey" :disabled="true"/>
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option
                v-for="item in dataScopeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope == 2">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选
          </el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动
          </el-checkbox>
          <el-tree
              class="tree-border"
              :data="deptOptions"
              show-checkbox
              default-expand-all
              ref="deptRef"
              node-key="id"
              :check-strictly="!form.deptCheckStrictly"
              empty-text="加载中，请稍候"
              :props="{ label: 'label', children: 'children' }"
          ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitDataScope">确 定</el-button>
          <el-button @click="cancelDataScope">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="LiveCodeLocal">
import {
  addRole,
  changeRoleStatus,
  dataScope,
  delRole,
  getRole,
  updateRole,
  deptTreeSelect
} from "@/api/system/role";
import {
  listLiveCodeLocal,
  addLiveCodeLocal,
  getLiveCodeLocal,
  updateLiveCodeLocal,
  changeLiveCodeLocalStatus,
  deleteLiveCodeLocal,
  getLiveCodeLocalImg
} from "@/api/business/batch_invitation/liveCodeLocal.js"
import {roleMenuTreeselect, treeselect as menuTreeselect} from "@/api/system/menu";

const router = useRouter();
const {proxy} = getCurrentInstance();
const {sys_normal_disable} = proxy.useDict("sys_normal_disable");
import {genFileId} from 'element-plus'

const roleList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dateRange = ref([]);
const menuOptions = ref([]);
const menuExpand = ref(false);
const menuNodeAll = ref(false);
const deptExpand = ref(true);
const deptNodeAll = ref(false);
const deptOptions = ref([]);
const openDataScope = ref(false);
const menuRef = ref(null);
const deptRef = ref(null);
const uploadFile = ref(null)
const file = ref(null)

const changeFile = (uploadFile) => {
  file.value = uploadFile;
}
const handleExceed = (files) => {
  uploadFile.value.clearFiles();
  const fileTemp = files[0];
  fileTemp.uid = genFileId();
  uploadFile.value.handleStart(fileTemp);
}
// const uploadForm = reactive({
//   data: {
//     name: '',
//     status: '',
//     remark: ''
//   }
// })
// const submitUpload = () => {
//   const jsonStr = JSON.stringify(uploadForm.data);
//   const blob = new Blob([jsonStr], {
//     type: 'application/json'
//   });
//   let formData = new FormData();
//   formData.append("obj", blob);
//   formData.append('name', 'test')
//   // 这里很重要 file.value.raw才是真实的file文件，file.value只是一个Proxy代理对象
//   formData.append("file", file.value.raw);
//   let headers =
//       {
//         'Accept': 'application/json',
//         'Content-Type': 'multipart/form-data'
//       };
//   addLiveCodeLocal(formData, headers).then(res => {
//     console.log(res)
//   })
//   // axios({
//   //   method,
//   //   url,
//   //   data: formData,
//   //   headers
//   // }).then(res => {
//   //   console.log(res);
//   //   console.log(res.data);
//   // });
// }

const copyToClipboard=(text)=> {
  navigator.clipboard
      .writeText(text)
      .then(() => {
        proxy.$modal.msgSuccess("复制成功");
      })
      .catch(() => {
        proxy.$modal.msgError("复制失败");
      });
}

/** 数据范围选项*/
const dataScopeOptions = ref([
  {value: "1", label: "全部数据权限"},
  {value: "2", label: "自定数据权限"},
  {value: "3", label: "本部门数据权限"},
  {value: "4", label: "本部门及以下数据权限"},
  {value: "5", label: "仅本人数据权限"}
]);

const data = reactive({
  form: {},
  queryParams: {
    page: 1,
    size: 10,
    name: undefined,
    roleKey: undefined,
    status: undefined
  },
  rules: {
    name: [{required: true, message: "活码名称不能为空", trigger: "blur"}],
  },
});

const {queryParams, form, rules} = toRefs(data);

/** 查询角色列表 */
function getList() {
  loading.value = true;
  listLiveCodeLocal(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
    roleList.value = response.records;
    total.value = response.total;
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.page = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idsData = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除活码编号为"' + idsData + '"的数据项?').then(function () {
    const data = {
      ids: idsData
    }
    return deleteLiveCodeLocal(data);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/role/export", {
    ...queryParams.value,
  }, `role_${new Date().getTime()}.xlsx`);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 角色状态修改 */
function handleStatusChange(row) {
  let text = row.status === "0" ? "启用" : "停用";
  proxy.$modal.confirm('确认要"' + text + '""' + row.name + '"活码吗?').then(function () {
    return changeLiveCodeLocalStatus({
      id: row.id,
      status: row.status
    });
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.status = row.status === "0" ? "1" : "0";
  });
}

/** 更多操作 */
function handleCommand(command, row) {
  switch (command) {
    case "handleDataScope":
      handleDataScope(row);
      break;
    case "handleAuthUser":
      handleAuthUser(row);
      break;
    default:
      break;
  }
}

/** 分配用户 */
function handleAuthUser(row) {
  router.push("/system/role-auth/user/" + row.id);
}

/** 查询菜单树结构 */
function getMenuTreeselect() {
  menuTreeselect().then(response => {
    menuOptions.value = response.data;
  });
}

/** 所有部门节点数据 */
function getDeptAllCheckedKeys() {
  // 目前被选中的部门节点
  let checkedKeys = deptRef.value.getCheckedKeys();
  // 半选中的部门节点
  let halfCheckedKeys = deptRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}

/** 重置新增的表单以及其他数据  */
function reset() {
  if (menuRef.value != undefined) {
    menuRef.value.setCheckedKeys([]);
  }
  menuExpand.value = false;
  menuNodeAll.value = false;
  deptExpand.value = true;
  deptNodeAll.value = false;
  if (uploadFile.value != null) {
    uploadFile.value.clearFiles();
  }
  form.value = {
    id: undefined,
    name: undefined,
    status: "0",
    remark: undefined,
  };
  proxy.resetForm("liveCodeLocalRef");
}

/** 添加角色 */
function handleAdd() {
  reset();
  getMenuTreeselect();
  open.value = true;
  title.value = "添加角色";
}

/** 修改本地活码 */
function handleUpdate(row) {
  reset();
  const idsData = row.id || ids.value;
  getLiveCodeLocal(idsData).then(response => {
    form.value = response;
    open.value = true;
    nextTick(() => {

      getLiveCodeLocalImg(response.id).then((res) => {

        uploadFile.value = res
      })
    });
    title.value = "修改活码";
  });
}

/** 根据角色ID查询菜单树结构 */
function getRoleMenuTreeselect(id) {
  return roleMenuTreeselect(id).then(response => {
    menuOptions.value = response.menus;
    return response;
  });
}

/** 根据角色ID查询部门树结构 */
function getDeptTree(id) {
  return deptTreeSelect(id).then(response => {
    deptOptions.value = response.depts;
    return response;
  });
}

/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value, type) {
  if (type == "menu") {
    let treeList = menuOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  } else if (type == "dept") {
    let treeList = deptOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      deptRef.value.store.nodesMap[treeList[i].id].expanded = value;
    }
  }
}

/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value, type) {
  if (type == "menu") {
    menuRef.value.setCheckedNodes(value ? menuOptions.value : []);
  } else if (type == "dept") {
    deptRef.value.setCheckedNodes(value ? deptOptions.value : []);
  }
}

/** 树权限（父子联动） */
function handleCheckedTreeConnect(value, type) {
  if (type == "menu") {
    form.value.menuCheckStrictly = value ? true : false;
  } else if (type == "dept") {
    form.value.deptCheckStrictly = value ? true : false;
  }
}

/** 所有菜单节点数据 */
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["liveCodeLocalRef"].validate(valid => {
    if (valid) {

      // 要用 FormData 来承载文件！这是重点
      const formData = new FormData();
      // 向 FormData 中动态添加数据
      Object.keys(form.value).forEach(key => {
        // 如果值为 undefined，则设置为一个空字符串或者跳过
        const value = form.value[key] === undefined ? '' : form.value[key];
        formData.append(key, value);
      });

      formData.append('file', file.value.raw)

      const headers =
          {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
          };
      if (form.value.id != undefined) {

        updateLiveCodeLocal(formData, headers).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addLiveCodeLocal(formData, headers).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }

      file.value = undefined
    }
  });
}

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
}

/** 选择角色权限范围触发 */
function dataScopeSelectChange(value) {
  if (value !== "2") {
    deptRef.value.setCheckedKeys([]);
  }
}

/** 分配数据权限操作 */
function handleDataScope(row) {
  reset();
  const deptTreeSelect = getDeptTree(row.id);
  getRole(row.id).then(response => {
    form.value = response.data;
    openDataScope.value = true;
    nextTick(() => {
      deptTreeSelect.then(res => {
        nextTick(() => {
          if (deptRef.value) {
            deptRef.value.setCheckedKeys(res.checkedKeys);
          }
        });
      });
    });
    title.value = "分配数据权限";
  });
}

/** 提交按钮（数据权限） */
function submitDataScope() {
  if (form.value.id != undefined) {
    form.value.deptIds = getDeptAllCheckedKeys();
    dataScope(form.value).then(response => {
      proxy.$modal.msgSuccess("修改成功");
      openDataScope.value = false;
      getList();
    });
  }
}

/** 取消按钮（数据权限）*/
function cancelDataScope() {
  openDataScope.value = false;
  reset();
}

getList();
</script>
