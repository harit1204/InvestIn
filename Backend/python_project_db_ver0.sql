create database python_project;
use python_project;

create table person(
id varchar(35) primary key, 
typep varchar(2),
namep varchar(40),
email varchar(40) not null,
phone long,
passwordp varchar(30) not null,
web text,
linkd text,
tweet text,
insta text,
auth bool,
incproof varchar(20),
aadhar_no varchar(12),
pan_no varchar(15),
check(typep in ('b','i')));

create table buisness_person(
b_id varchar(35) primary key,
cat varchar(10) default('NA'),
bname varchar(45),
bloc varchar(35),
bdesc text default('-'),
bdetails text default('not given'),
annual_inc long,
bproof varchar(20),
other_details text,
foreign key(b_id) references person.id);

create table investor(
i_id varchar(35) primary key,
cat varchar(10) default('NA'),
loc varchar(35),
prev_inv text default('-'),
annual_inc long,
other_details text,
foreign key(i_id) references person.id);

create table blocked(
blocked_by varchar(35),
is_blocked varchar(35),
reason text,
on_dt datetime,
primary key(blocked_by,is_blocked),
foreign key(blocked_by) references person.id,
foreign key(is_blocked) references person.id);

create table contacted(
initiator varchar(35),
contacted varchar(35),
medium_used text,
on_dt datetime,
primary key(initiator,contacted),
foreign key(initiator) references person.id,
foreign key(contacted) references person.id);

create table feedback(
f_id int,
person_id varchar(35),
feedback_text text,
stars int,
on_dt datetime,
check(stars between 1 and 5),
primary key(f_id),
foreign key(person_id) references person.id);

create table investment_record(
inv_id int primary key,
i_id varchar(35),
b_id varchar(35),
amt long,
on_dt datetime,
auth bool,
foreign key(i_id) references investor.i_id,
foreign key(b_id) references buisness_person.b_id);