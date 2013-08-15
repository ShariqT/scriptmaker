var Page = {
	content: '',
	$el: $('#script_page'),

	showActionForm: function(){
		$('#action').show();
	},

	showDialogueForm: function(){
		//add a ajax call to supply the characters
		var data = [
			'Select A Character',
			'Joseph',
			'Mary',
			'John'
		];
		
		var output = Mustache.render($('#charlist').html(), {char_found: true,characters:data}, {clist: $('#clist').html()});
		$('#character').html(output).show();
	},

	showSlugForm: function(){
		//add a ajax call to supply the slugs
		var data = [
			'Choose A Location',
			'Manger',
			'Bethelem',
			'Galliee'
		];

		Mustache.render($('#slugform').html(), {slugs: data}, {slugs: $('#previous_slugs').html()});
		$('#slug').show();
	},

	addContentToPage: function(content){
		var html = this.$el.html();
		this.$el.html(html + content);
	}
};


var ScriptElement = function(){
	this.text;
	this.template;
	this.$formValue;
}


ScriptElement.prototype.getText = function(){
	this.text = this.$formValue.val();
	return this;
}

ScriptElement.prototype.render = function(){
	console.log(Mustache.render(this.template, {text: this.text}));
	return Mustache.render(this.template, {text: this.text});

}


ScriptElement.prototype.clear = function(){

}

var Action = function(){
	this.template = "<p class='action'>{{text}}</p>";
	this.$formValue = $('textarea[name=text]');
}

Action.prototype = new ScriptElement();

Action.prototype.clear = function(){
	$('textarea[name=text]').val('');

}


var Slug = function(){
	this.location;
	this.time_of_scene;
	this.slug;
	this.template = "<p class='slugline'>{{location}} {{slug}} - {{time_of_scene}}</p>";
}

Slug.prototype = new ScriptElement();

Slug.prototype.getText = function(){
	//we'll override the default form value because
	//we need many different things to form an accurate slug
	this.location = $('select[name=location]').val();
	this.time_of_scene = $('select[name=time]').val();
	if( $('select[name=slug]').val() !== 'Choose A Location'){
		this.slug = $('select[name=slug]').val();
	}else{
		this.slug = $('select[name=new_slug]').val();
	}

	return this;
}


Slug.prototype.render = function(){
	return Mustache.render(this.template, {location:this.location, slug: this.slug, time_of_scene: this.time_of_scene});
}

Slug.prototype.clear = function(){
	$('select[name=location]').val('');
	$('select[name=time]').val('');
	$('select[name=slug]').val('Choose A Location');
	$('select[name=new_slug]').val();
}

var Character = function(){
	if( $('select[name=character_name]').val() !== 'Select A Character'){
		this.$formValue = $('select[name=character_name]');
		this.is_select = true;
	}else{
		this.$formValue = $('input[name=n_character_name]');
		this.is_select = false;
	}

	this.template = "<div class='character'><p>{{character}}</p><p class='dialog'>{{dialogue}}</p></div>";
	this.dialogue;
}

Character.prototype = new ScriptElement();

Character.prototype.getText = function(){
	this.text = this.$formValue.val();
	this.dialogue = $('textarea[name=dialogue]').val();
	return this;
}


Character.prototype.render = function(){
	return Mustache.render(this.template, {character: this.text, dialogue: this.dialogue});
}

Character.prototype.clear = function(){
	if(this.is_select){
		this.$formValue.val('Choose A Character');
	}else{
		this.$formValue.val('');
	}
	$('textarea[name=dialogue]').val('');
}

var page = Page;
var keys = [];
$('body').on('keydown', function(evt){
	keys.push(evt.which);
	var last_two_keys = keys.slice(-2).toString();
	console.log(last_two_keys);
	if (evt.which == 18){
		evt.preventDefault();
	}

	if( last_two_keys == '18,65'){
		page.showActionForm();
	}

	if(last_two_keys == '18,67'){
		page.showDialogueForm();
	}
});

$('body').on('click', '.addAction', function(event){
	var action = new Action();
	var new_content = action.getText().render();
	action.clear();
	page.addContentToPage(new_content);

});

$('body').on('click', '.addCharacter', function(event){
	var character = new Character();
	var new_content = character.getText().render();
	character.clear();
	page.addContentToPage(new_content);

});

var script_page = document.getElementById('script_page');
script_page.contentEditable = true;


