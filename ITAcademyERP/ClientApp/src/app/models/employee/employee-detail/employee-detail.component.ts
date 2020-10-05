import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { EmployeeService }  from '../employee.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { OrderHeaderService } from 'src/app/models/order-header/order-header.service';
import { OrderHeader } from '../../order-header/order-header';
import { AddressService } from '../../address/address.service';
import { AccountService } from 'src/app/login/account.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private addressService: AddressService,
    private orderHeaderService: OrderHeaderService,
    private accountService: AccountService,
    private location: Location
  ) { }

  editionMode: boolean = false;
  formGroup: FormGroup;
  employeeId: any;
  personId: any;
  addressesToDelete: number[] = [];

  employees: Employee[];  
  currentOhs: OrderHeader[];
  oldOhs: OrderHeader[];

  get addresses(): FormArray {
    return this.formGroup.get('addresses') as FormArray;
    
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      email:'',
      firstName: '',
      lastName: '',
      addresses: this.fb.array([]),
      position: '',
      salary: ''
    });  

    this.route.params.subscribe(params => {
      if (params["id"] == undefined){
        return;
      }
      this.editionMode = true;

      this.employeeId = params["id"];

      this.employeeService.getEmployee(this.employeeId.toString())
      .subscribe(employee => {
        this.loadForm(employee);
        this.personId = employee.personId;
      });

      this.orderHeaderService.getOHByEmployee(this.employeeId)
      .subscribe(orderHeaders => {
        this.currentOhs = orderHeaders.filter(oh => oh.orderState == "En repartiment" || oh.orderState == "En tractament" ||  oh.orderState == "Pendent de tractar"); 
        this.oldOhs = orderHeaders.filter(oh => oh.orderState == "Completat" || oh.orderState == "Cancel·lat");
      }
      );   
    });
  }

  addAddress(){
    let addressFG = this.buildAddress();
    this.addresses.push(addressFG);
  }

  buildAddress(){
    return this.fb.group({
      id: 0,
      personId: this.personId != null ? this.personId : '',
      name: '',
      type: ''
    })
  }
    
  deleteAddress(index: number){
    let addressToDelete = this.addresses.at(index) as FormGroup;
    if (addressToDelete.controls['id'].value != 0) {
      this.addressesToDelete.push(<number>addressToDelete.controls['id'].value);
    }
    this.addresses.removeAt(index);
  }

  loadForm(employee: Employee){
    this.formGroup.patchValue({
      email: employee.email,
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position,
      salary: employee.salary
    });

    employee.addresses.forEach(address => {
      let addressFG = this.buildAddress();
      addressFG.patchValue(address);
      this.addresses.push(addressFG);
    })
  }

  save() {
    let employee: Employee = Object.assign({}, this.formGroup.value);
    console.table(employee);

    if (this.editionMode){
      //edit employee     
      this.employeeId = parseInt(this.employeeId);
      employee.id = this.employeeId;      
      this.employeeService.updateEmployee(employee)
      .subscribe();
    } else {
      //add employee
      this.employeeService.addEmployee(employee)
      .subscribe();
    }    
  }

  deleteAddresses(){
    if (this.addressesToDelete.length === 0) {
      return;
    }

    this.addressService.deleteAddresses(this.addressesToDelete)
    .subscribe();
  }
  
  goBack(): void {
    this.location.back();
  }

  isAdminUser() {
    if (this.accountService.isLogged() && localStorage.getItem('isAdminUser') == 'true') {
      return true;
    }
    return false;
  }

}
